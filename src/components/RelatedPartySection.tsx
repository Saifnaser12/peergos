import React from 'react';
import { useRelatedParty } from '../context/RelatedPartyContext';
import Toggle from './Toggle';
import RelatedPartyTable from './RelatedPartyTable';
import Card from './Card';

const RelatedPartySection: React.FC = () => {
  const { showRelatedParty, toggleRelatedParty, transactions } = useRelatedParty();

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Related Party Transactions
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and view your related party transactions
            </p>
          </div>
          <Toggle
            enabled={showRelatedParty}
            onChange={toggleRelatedParty}
            label="Show Related Party Transactions"
          />
        </div>

        {showRelatedParty && (
          <div className="mt-6">
            {transactions.length > 0 ? (
              <RelatedPartyTable transactions={transactions} />
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No related party transactions found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RelatedPartySection; 