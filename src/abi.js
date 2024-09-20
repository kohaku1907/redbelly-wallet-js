const priceFeedABI = [
    {
      inputs: [],
      name: "getLatestPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  
  const bootstrapRegistryABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "contractName",
          type: "string",
        },
      ],
      name: "getContractAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  
  module.exports = {
    priceFeedABI,
    bootstrapRegistryABI
  };