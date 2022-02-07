import React from "react";
import { useChainId } from "../hooks/web3/web3Context";
import { useAllTransactions } from "../state/transactions/hooks";

interface TransactionProps {
  hash: string;
}

const Transaction: React.FC<TransactionProps> = ({ hash }) => {
  const chainId = useChainId();
  const allTransactions = useAllTransactions();

  const tx = allTransactions?.[hash];
  const summary = tx?.summary;
  const pending = !tx?.confirmedTime;
  const success =
    !pending &&
    tx &&
    tx.receipt &&
    (tx.receipt.status === 1 || typeof tx.receipt.status === "undefined");

  if (!chainId) return null;

  return <>{pending ? "pending" : success ? "success" : ""}</>;
  // <Box className={classes.transactionState}>
  //   <a
  //     className={classes.transactionStatusText}
  //     href={getEtherscanLink(chainId, hash, 'transaction')}
  //     target='_blank'
  //     rel='noreferrer'
  //   >
  //     {summary ?? hash} ↗
  //   </a>
  //   <Box className={classes.iconWrapper}>
  //     {pending ? (
  //       <CircularProgress size={16} />
  //     ) : success ? (
  //       <CheckCircle size='16' />
  //     ) : (
  //       <Triangle size='16' />
  //     )}
  //   </Box>
  // </Box>
};

export default Transaction;
