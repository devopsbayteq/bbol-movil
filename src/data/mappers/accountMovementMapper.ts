import {AccountMovement} from '../../domain/entities/AccountMovement';
import {TransactionListItemApiModel} from '../models/TransactionListApiModels';

export function mapTransactionListItemToEntity(
  model: TransactionListItemApiModel,
): AccountMovement {
  return {
    transactionGuid: model.transactionGuid,
    transactionIdentifier: model.transactionIdentifier,
    beneficiaryName: model.beneficiaryName,
    beneficiaryAccountTypeLabel: model.beneficiaryAccountTypeLabel,
    beneficiaryAccountNumber: model.beneficiaryAccountNumber,
    ownerAccountLabel: model.ownerAccountLabel,
    accountNumber: model.accountNumber,
    accountTypeLabel: model.accountTypeLabel,
    destinationLastFourDigits: model.destinationLastFourDigits,
    amount: model.amount,
    transferDate: model.transferDate,
    transactionTypeLabel: model.transactionTypeLabel,
    transactionType: model.transactionType,
    balanceAfterTransaction: model.balanceAfterTransaction,
  };
}

export function mapTransactionListItemsToEntities(
  models: TransactionListItemApiModel[],
): AccountMovement[] {
  return models.map(mapTransactionListItemToEntity);
}
