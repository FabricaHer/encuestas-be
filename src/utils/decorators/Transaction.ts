import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * HandlerTransaction decorator
 *
 * This decorator function handles transactions for the provided method.
 * It starts a transaction, executes the original method,
 * and commits the transaction if successful or rolls it back if an error occurs.
 * Finally, it releases the resources used for the transaction.
 *
 * @param {any} target - The target object
 * @param {string} propertyKey - The key of the property
 * @param {PropertyDescriptor} descriptor - The property descriptor
 * @return {Function} The result of the original method with transaction handling
 */
export function Transaction(): Function {
  // Inject the data source into the target object
  const injectDataSource = Inject(DataSource);

  // Return a decorator function that wraps the original method
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Store a reference to the original method
    const originalMethod = descriptor.value;

    // Inject the data source into the current object
    injectDataSource(target, 'dataSource');

    // Define the new method, which wraps the original method
    descriptor.value = async function (...args: any[]) {
      const dataSource: DataSource = this.dataSource;

      // Create a new query runner
      const queryRunner = dataSource.createQueryRunner();
      let transactionStartedByUs = false;

      try {
        // If no transaction is currently active, start a new one
        if (!queryRunner.isTransactionActive) {
          await queryRunner.startTransaction();
          transactionStartedByUs = true;
        }

        // Add the query runner to the arguments list of the original method
        args = [...args, queryRunner];

        // Execute the original method with the modified arguments list
        const result = await originalMethod.apply(this, args);

        // If we started the transaction, commit it
        if (transactionStartedByUs) {
          await queryRunner.commitTransaction();
        }

        // Return the result of the original method
        return result;
      } catch (error) {
        // If an error occurred and we started the transaction, roll it back
        if (transactionStartedByUs) {
          await queryRunner.rollbackTransaction();
        }

        // Re-throw the error
        throw error;
      } finally {
        // Release the resources used by the query runner
        if (queryRunner) {
          await queryRunner.release();
        }
      }
    };
  };
}
