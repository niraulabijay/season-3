import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "ethers";

export async function submitTransaction(
    contract: Contract | null,
    account: string, 
    methodsName: string,
    args: Array<string | number | BigNumber | Array<any>>,
    ): Promise<any>{
    try {
        const callData =  contract?.[methodsName](...args)
        return callData
    } catch (e) {
      console.log(e)
      return e
    }
}