// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
/* 
Les spécifications :
•⁠  ⁠Name: $ERA token
•⁠  ⁠Symbol: $ERA
•⁠  ⁠Supply: 1,000,000,000 $ERA
•⁠  ⁠Decimals: 18*/

contract TamkinToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("$ERA token", "$ERA") {
        _mint(msg.sender, initialSupply);
    }

    function burn(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Not enough tokens to burn");
        _burn(msg.sender, amount);
    }
}