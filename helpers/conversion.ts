import { BigNumber, ethers } from "ethers";

// Convert Big Number with Decimal Place Zeros to readable value (eg: wei(BN) to ether(BN))
export const decimalToExact = (value:BigNumber, decimals:number) => {
  const decimalValue = ethers.utils.parseUnits(
    "1",
    decimals
  );
  if(value && value instanceof BigNumber){
    const exactValueBigNumber = value.mul("10000").div(decimalValue);
    const exactValue = parseFloat(ethers.utils.formatUnits(exactValueBigNumber, 4));
    return exactValue;
  }
  return 0;
}

// Convert user readable to decimal zeros amount (eg: ether (integer/float) to wei (BN))
export const exactToDecimal = (value: number|string, decimals: number) => {
  return ethers.utils.parseUnits(
    value.toString(),
    decimals
  );
}
