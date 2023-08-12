
const truncateWallet = input => {
    if (input.length > 10) {
        return input.substring(0, 5) + '...' + input.substring(input.length - 4, input.length);
     }
     return input;
}

export default truncateWallet;