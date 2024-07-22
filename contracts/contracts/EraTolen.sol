// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
/* 
Les spécifications :
•⁠  ⁠Name: $ERA token
•⁠  ⁠Symbol: $ERA
•⁠  ⁠Supply: 1,000,000,000 $ERA
•⁠  ⁠Decimals: 18*/

contract erableToken is ERC20 {
    constructor(uint256 initialSupply, address sigWallet) ERC20("$ERA token", "$ERA") {
        _mint(sigWallet, initialSupply);
    }

    function burn(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Not enough tokens to burn");
        _burn(msg.sender, amount);
    }
}
