//SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ITreasury.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Treasury is ITreasury, Ownable {
    using SafeMath for uint256;

    address public stakingContract;
    address public deployer;

    IERC20 public stakingToken;

    event Deposit(address user, uint256 amount);
    event Withdrawal(address user, uint256 amount);
    event LogWithdrawalBNB(address account, uint256 amount);
    event LogWithdrawToken(address token, address account, uint256 amount);
    event LogUpdateDeployerAddress(address newDeployer);

    /**
     * @dev Throws if called by any account other than the owner or deployer.
     */
    modifier onlyDeployer() {
        require(
            deployer == _msgSender(),
            "Ownable: caller is not the deployer"
        );
        _;
    }

    constructor(address _stakingToken, address _stakingContract) {
        require(
            _stakingContract != address(0),
            "StakingContract Address 0 validation"
        );
        require(
            _stakingToken != address(0),
            "StakingToken Address 0 validation"
        );
        deployer = _msgSender();
        stakingContract = _stakingContract;
        stakingToken = IERC20(_stakingToken);
        transferOwnership(_stakingContract);
    }

    function deposit(address staker, uint256 amount) external onlyOwner {
        require(
            stakingToken.allowance(staker, address(this)) >= amount,
            "Insufficient allowance."
        );
        stakingToken.transferFrom(staker, address(this), amount);
        emit Deposit(staker, amount);
    }

    function withdraw(address staker, uint256 amount) external onlyOwner {
        stakingToken.transfer(staker, amount);
        emit Withdrawal(staker, amount);
    }

    function withdrawBNB(
        address payable account,
        uint256 amount
    ) external onlyDeployer {
        require(amount <= (address(this)).balance, "Incufficient funds");
        safeTransferBNB(account, amount);
        emit LogWithdrawalBNB(account, amount);
    }

    // Internal function to handle safe transfer
    function safeTransferBNB(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success);
    }

    /**
     * @notice Should not be withdrawn scam token.
     */
    function withdrawToken(
        address token,
        address account,
        uint256 amount
    ) external onlyDeployer {
        require(
            amount <= IERC20(token).balanceOf(account),
            "Incufficient funds"
        );
        require(token != address(stakingToken), "Can't withdraw stakingToken");
        require(IERC20(token).transfer(account, amount), "Transfer Fail");

        emit LogWithdrawToken(address(token), account, amount);
    }

    function updateDeployerAddress(address newDeployer) external onlyDeployer {
        require(deployer != newDeployer, "The address is already set");
        deployer = newDeployer;
        emit LogUpdateDeployerAddress(newDeployer);
    }
}
