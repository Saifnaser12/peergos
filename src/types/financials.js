export var AccountType;
(function (AccountType) {
    AccountType["ASSET"] = "ASSET";
    AccountType["LIABILITY"] = "LIABILITY";
    AccountType["EQUITY"] = "EQUITY";
    AccountType["REVENUE"] = "REVENUE";
    AccountType["EXPENSE"] = "EXPENSE";
})(AccountType || (AccountType = {}));
export var AccountCategory;
(function (AccountCategory) {
    // Asset categories
    AccountCategory["CURRENT_ASSETS"] = "CURRENT_ASSETS";
    AccountCategory["FIXED_ASSETS"] = "FIXED_ASSETS";
    AccountCategory["INTANGIBLE_ASSETS"] = "INTANGIBLE_ASSETS";
    AccountCategory["OTHER_ASSETS"] = "OTHER_ASSETS";
    // Liability categories
    AccountCategory["CURRENT_LIABILITIES"] = "CURRENT_LIABILITIES";
    AccountCategory["LONG_TERM_LIABILITIES"] = "LONG_TERM_LIABILITIES";
    AccountCategory["OTHER_LIABILITIES"] = "OTHER_LIABILITIES";
    // Equity categories
    AccountCategory["SHARE_CAPITAL"] = "SHARE_CAPITAL";
    AccountCategory["RETAINED_EARNINGS"] = "RETAINED_EARNINGS";
    AccountCategory["RESERVES"] = "RESERVES";
})(AccountCategory || (AccountCategory = {}));
