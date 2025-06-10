
import { backupService } from '../services/BackupService';

export const createSystemPhase1Backup = async (): Promise<string> => {
  try {
    console.log('🔄 Creating System Phase 1 backup...');
    
    const backupId = await backupService.createBackup(
      'System Phase 1 - Complete system state with all features implemented'
    );
    
    console.log(`✅ System Phase 1 backup created successfully: ${backupId}`);
    console.log('📋 Backup includes:');
    console.log('   • All revenue/expense entries');
    console.log('   • Invoice data and templates');
    console.log('   • Tax forms (CIT/VAT)');
    console.log('   • User settings and preferences');
    console.log('   • Uploaded files and documents');
    console.log('   • Complete system configuration');
    
    return backupId;
  } catch (error) {
    console.error('❌ Failed to create System Phase 1 backup:', error);
    throw new Error('Failed to create system backup');
  }
};

// Auto-execute the backup when this module is imported
createSystemPhase1Backup().catch(console.error);
