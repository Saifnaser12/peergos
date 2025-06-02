export const permissions = {
    SME: {
        setup: { view: true, edit: true },
        filing: { view: true, edit: true },
        dashboard: { view: true, edit: false },
        trnSearch: { view: false, edit: false },
        assistant: { view: true, edit: false }
    },
    'Tax Agent': {
        setup: { view: true, edit: false },
        filing: { view: true, edit: false },
        dashboard: { view: true, edit: false },
        trnSearch: { view: false, edit: false },
        assistant: { view: true, edit: false }
    },
    Admin: {
        setup: { view: true, edit: true },
        filing: { view: true, edit: true },
        dashboard: { view: true, edit: true },
        trnSearch: { view: true, edit: true },
        assistant: { view: true, edit: true }
    },
    FTA: {
        setup: { view: false, edit: false },
        filing: { view: false, edit: false },
        dashboard: { view: true, edit: false },
        trnSearch: { view: true, edit: true },
        assistant: { view: false, edit: false }
    }
};
