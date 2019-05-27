import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Driver from '../../../../../../lib/Driver';
import directory from '../../../../../../directory';
import Printify from '../../../../../../lib/Printify';
import AssetCard2 from '../../../../../Common/AssetCard2/AssetCard2';

export default function BalancesTable(props) {
    const account = props.d.session.account;
    // getSortedBalances from MagicSpoon.Account
    // Then generating USD balance and trade-link
    const allBalances = account.getSortedBalances().map((balance) => {
        if (props.d.ticker.ready) {
            const tickerAsset = _.find(props.d.ticker.data.assets, {
                code: balance.code,
                issuer: balance.issuer,
            });

            let tradeLink;
            if (tickerAsset) {
                const balanceUSD = (balance.balance * tickerAsset.price_USD).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                Object.assign(balance, { balanceUSD });

                if (tickerAsset.price_USD === undefined) {
                    tickerAsset.price_USD = 0;
                }

                if (tickerAsset.slug !== 'XLM-native') {
                    tradeLink = (
                        <a href={`#exchange/${tickerAsset.topTradePairSlug}`} className="BalancesTable__row__trade">
                            trade
                        </a>
                    );
                }
            } else {
                tradeLink = (
                    <a
                        href={`#exchange/${balance.code}-${balance.issuer}/XLM-native`}
                        className="BalancesTable__row__trade">
                        trade
                    </a>
                );
            }
            Object.assign(balance, { tradeLink });
        }
        return balance;
    });

    const sortedByUSD = _.orderBy(allBalances, ['balanceUSD'], ['desc']);
    const balanceRows = sortedByUSD.map((asset) => {
        const { code, issuer, balance, tradeLink } = asset;
        const balanceUSD = `$${asset.balanceUSD}`;
        const directoryAsset = directory.getAssetByAccountId(balance.code, balance.issuer);

        let warning;
        if (directoryAsset !== null && directoryAsset.warning !== undefined) {
            warning = (
                <div className="s-alert s-alert--warning BalancesTable__row__item__warning">
                    {directoryAsset.warning}
                </div>
            );
        }
        return (
            <tr className="BalancesTable__row" key={code + issuer}>
                <td className="BalancesTable__row__item BalancesTable__row__item--assetCard">
                    <AssetCard2 code={code} issuer={issuer} d={props.d} />
                    {warning}
                </td>
                <td className="BalancesTable__row__item BalancesTable__row__item--amount">
                    {Printify.lightenZeros(balance)}
                </td>
                <td className="BalancesTable__row__item BalancesTable__row__item--amount">{balanceUSD}</td>
                <td className="BalancesTable__row__item BalancesTable__row__item--amount">{tradeLink}</td>
            </tr>
        );
    });

    return (
        <table className="BalancesTable">
            <thead>
                <tr className="BalancesTable__head">
                    <td
                        className="BalancesTable__head__cell
                        BalancesTable__row__item--heading BalancesTable__head__asset">
                        Asset
                    </td>
                    <td
                        className="BalancesTable__head__cell
                        BalancesTable__row__item--heading BalancesTable__head__amount">
                        Balance
                    </td>
                    <td
                        className="BalancesTable__head__cell
                        BalancesTable__row__item--heading BalancesTable__head__amount">
                        Value (USD)
                    </td>
                    <td
                        className="BalancesTable__head__cell
                        BalancesTable__row__item--heading BalancesTable__head__amount" />
                </tr>
            </thead>
            <tbody>{balanceRows}</tbody>
        </table>
    );
}

BalancesTable.propTypes = {
    d: PropTypes.instanceOf(Driver).isRequired,
};
