import Home from './Home3'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    InkDrop: state.contracts.InkDrop,
    drizzleStatus: state.drizzleStatus,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
  }
}

const HomeContainer = drizzleConnect(Home, mapStateToProps)

export default HomeContainer
