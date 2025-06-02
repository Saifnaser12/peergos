import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRelatedParty } from '../context/RelatedPartyContext';
import Toggle from './Toggle';
import RelatedPartyTable from './RelatedPartyTable';
import Card from './Card';
const RelatedPartySection = () => {
    const { showRelatedParty, toggleRelatedParty, transactions } = useRelatedParty();
    return (_jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Related Party Transactions" }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "Manage and view your related party transactions" })] }), _jsx(Toggle, { enabled: showRelatedParty, onChange: toggleRelatedParty, label: "Show Related Party Transactions" })] }), showRelatedParty && (_jsx("div", { className: "mt-6", children: transactions.length > 0 ? (_jsx(RelatedPartyTable, { transactions: transactions })) : (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No related party transactions found" }) })) }))] }) }));
};
export default RelatedPartySection;
