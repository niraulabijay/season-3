import { Contract } from "web3-eth-contract";

export async function evaluateTransaction(
  contract: Contract | null,
  methodName: string,
  args: Array<string | number>
): Promise<any> {
try {
  const methods = await contract?.methods
  const bcValues = await methods?.[methodName](...args)
  return bcValues.call()
} catch (e) {
   console.log(e)
   return e
}
} 