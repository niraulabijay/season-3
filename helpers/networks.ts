// address on Polygon (POS) networks
export type TokenDefinition = {
  name: string
  address : string,
  symbol: string,
  decimals: number,
  chainId: number,
  logoURI: string,
}

export const islaGaugeNetwork:TokenDefinition = {
  name: "IslaGauge",
  address : "0x2DE8a306732A5a8E0FbF1b2B8AA32FC9Bc958c2e",
  symbol: "ISLAG",
  decimals: 10,
  chainId: 137,
  logoURI: "",
}

export const usdtNetwork:TokenDefinition = {
  name: "Tether USD",
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  symbol: "USDT",
  decimals: 6,
  chainId: 137,
  logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
}

export const usdcNetwork:TokenDefinition = {
  name: "USDCoin",
  address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  symbol: "USDC",
  decimals: 6,
  chainId: 137,
  logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" 
}

export const daiNetwork:TokenDefinition = {
  name: "Dai Stablecoin",
  address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  symbol: "DAI",
  decimals: 18,
  chainId: 137,
  logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
}

export const bondingTokens = [
  daiNetwork, usdcNetwork, usdtNetwork
];