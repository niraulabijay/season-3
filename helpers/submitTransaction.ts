import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "web3-eth-contract";

export async function submitTransaction(
    contract: Contract | null,
    account: string, 
    methodsName: string,
    args: Array<string | number | BigNumber>,
    ): Promise<any>{
    try {
        const callData =   contract?.methods?.[methodsName](...args)
        return callData.send({
            from: account ? account : undefined,
        })
    } catch (e) {
      console.log(e)
      return e
    }
}