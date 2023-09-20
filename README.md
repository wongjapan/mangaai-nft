MangaAI Report :

old state (Anna made):

- Total Supply 100M
- max fees 10% (sell and buy can set separately)
- already have disable transfer
- already have sniper bot protection (explain in the next section)

new requirement:

- Total Supply 10M
- pause trading

added / modify new feature:

- pause trading
- Total Supply 10M

sniper bot protection:

- using gas price limit, this will not prevent 100% sniper bot to buy the token
  but this will make the sniper bot when buy token with high gas price will not
  receive the token 100%, because anna implement high fee when buy token with
  high gas price (upper than we set in the contract)
  sniper bot will only receive 0.1% and rest 99.9% will be sent to marketing wallet

- I want to implement blacklist wallet, but I think this will not help much
  because sniper bot will use new wallet address to buy the token

- I also want to implement blocktime, but I think this will not help much
  because when the blocktime is set, the sniper bot will wait until the blocktime
  is reached and then buy the token
  also its not good for the user, because when the blocktime is set, the user
  will wait until the blocktime is reached and then buy the token

  it also bad for audit, because when the blocktime is set, the audit will
  see if token cannot be sold or bought until the blocktime is reached

blocksafu audit Major issue:

- blacklist wallet
  there's no blacklist wallet in the contract, so it will not trigger Major Issue
- 100% fees
  already fixed (by anna), now the fees is 10% (sell and buy can set separately)
- Max TX
  there's no max tx in the contract, so it will not trigger Major Issue
- Transfer Pause
  this will not fixed, because you want transfer pause and trading pause
