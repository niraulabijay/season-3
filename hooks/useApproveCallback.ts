// import { MaxUint256 } from '@ethersproject/constants';
// import { TransactionResponse } from '@ethersproject/providers';
// import { BigNumber, Contract } from 'ethers';
// import { useCallback, useMemo } from 'react';
// import { useAddress } from '.';
// import { useTokenAllowance } from '../data/Allowance';
// import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';

// export enum ApprovalState {
//   UNKNOWN,
//   NOT_APPROVED,
//   PENDING,
//   APPROVED,
// }

// // returns a variable indicating the state of the approval and a function which approves if necessary or early returns
// export function useApproveCallback(
//   tokenContract: Contract,
//   amountToApprove: any,
//   spender: string,
// ): [ApprovalState, () => Promise<void>] {
//   const account = useAddress();
//   const currentAllowance = useTokenAllowance(
//     tokenContract,
//     account ?? undefined,
//     spender,
//   );
//   const pendingApproval = useHasPendingApproval(tokenContract.address, spender);

//   // check the current approval status
//   const approvalState: ApprovalState = useMemo(() => {
//     if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
//     // if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED;
//     // we might not have enough data to know whether or not we need to approve
//     if (!currentAllowance) return ApprovalState.UNKNOWN;

//     // amountToApprove will be defined if currentAllowance is
//     return currentAllowance.lessThan(amountToApprove)
//       ? pendingApproval
//         ? ApprovalState.PENDING
//         : ApprovalState.NOT_APPROVED
//       : ApprovalState.APPROVED;
//   }, [amountToApprove, currentAllowance, pendingApproval, spender]);

//   const addTransaction = useTransactionAdder();

//   const approve = useCallback(async (): Promise<void> => {
//     if (approvalState !== ApprovalState.NOT_APPROVED) {
//       console.error('approve was called unnecessarily');
//       return;
//     }
//     if (!token) {
//       console.error('no token');
//       return;
//     }

//     if (!tokenContract) {
//       console.error('tokenContract is null');
//       return;
//     }

//     if (!amountToApprove) {
//       console.error('missing amount to approve');
//       return;
//     }

//     if (!spender) {
//       console.error('no spender');
//       return;
//     }

//     return tokenContract
//       .approve(
//         spender,
//         amountToApprove
//       )
//       .then(async (response: TransactionResponse) => {
//         addTransaction(response, {
//           summary: 'Approve ' + amountToApprove.currency.symbol,
//           approval: { tokenAddress: token.address, spender: spender },
//         });
//         try {
//           await response.wait();
//         } catch (e) {
//           console.debug('Failed to approve token', e);
//           throw e;
//         }
//       })
//       .catch((error: Error) => {
//         console.debug('Failed to approve token', error);
//         throw error;
//       });
//   }, [
//     approvalState,
//     token,
//     tokenContract,
//     amountToApprove,
//     spender,
//     addTransaction,
//   ]);

//   return [approvalState, approve];
// }