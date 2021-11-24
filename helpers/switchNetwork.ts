const switchRequest = () => {
	return window.ethereum.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0x89" }]
	});
};

const addChainRequest = () => {
	return window.ethereum.request({
		method: "wallet_addEthereumChain",
		params: [
			{
				chainId: "0x89",
				chainName: "Polygon Mainnet",
				rpcUrls: [
					"https://polygon-rpc.com",
					"https://rpc-mainnet.matic.network"
				],
				blockExplorerUrls: ["https://polygonscan.com/"],
				nativeCurrency: {
					name: "Polygon",
					symbol: "MATIC",
					decimals: 18
				}
			}
		]
	});
};

export const switchNetwork = async () => {
	if (window.ethereum) {
		try {
			await switchRequest();
		} catch (error: any) {
			if (error.code === 4902) {
				try {
					await addChainRequest();
					await switchRequest();
				} catch (addError) {
					console.log(error);
				}
			}
			console.log(error);
		}
	}
};
