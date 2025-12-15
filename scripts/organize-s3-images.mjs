#!/usr/bin/env node

/**
 * S3 Image Organization Script
 * Organizes images in S3 bucket by project/repository
 */

import dotenv from 'dotenv';
import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

// Configuration
const BUCKET_NAME = 'graveyardjokes-cdn';
const AWS_REGION = 'us-east-2';
const DRY_RUN = true; // Set to false to actually move files

// Project mapping configuration
const PROJECT_MAPPING = {
  cryptescape: {
    patterns: [
      /cyrpt.*escape/i,
      /crypt.*escape/i,
      /games\/cyr/i,
    ],
    folder: 'cryptescape',
  },
  hollowpress: {
    patterns: [
      /hollow.*press/i,
      /hollowpress/i,
    ],
    folder: 'hollowpress',
  },
  lunarblood: {
    patterns: [
      /lunar.*blood/i,
      /lunarblood/i,
    ],
    folder: 'lunarblood',
  },
  thevelvetpulse: {
    patterns: [
      /velvet.*pulse/i,
      /thevelvetpulse/i,
    ],
    folder: 'thevelvetpulse',
  },
  velvetradio: {
    patterns: [
      /velvet.*radio/i,
      /velvetradio/i,
    ],
    folder: 'velvetradio',
  },
  studio: {
    patterns: [
      /illustration/i,
      /video-logs/i,
      /vlogs/i,
    ],
    folder: 'studio',
  },
  graveyardjokes: {
    patterns: [
      /graveyardjokes/i,
      /graveyard.*jokes/i,
      /profileimage/i,
      /joshua/i,
      /facebook|instagram|linkedin|twitter|snapchat|tiktok|youtube|whatsapp|pinterest/i,
      /laravel|react|mysql|tailwind/i,
      /skill.*radar.*chart/i,
      /contact.*banner/i,
      /about.*banner/i,
      /home.*top.*background/i,
      /skull.*boy/i,
      /documents/i,
      /adobe.*stock/i,
      /hover\.webp/i,
      /snapcode/i,
      /band|concert|venue|album.*cover|tour.*bus|vinyl|music/i,
      /kopf/i,
      /gym|sports?.*training/i,
      /deep.*sea|fish|enigmatic/i,
      /games\//i, // catch-all for games folder
    ],
    folder: 'graveyardjokes',
  },
};

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * List all objects in the S3 bucket
 */
async function listAllObjects() {
  const objects = [];
  let continuationToken = null;

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);
    
    if (response.Contents) {
      objects.push(...response.Contents);
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

/**
 * Determine which project a file belongs to based on its key/name
 */
function determineProject(key) {
  const filename = basename(key).toLowerCase();
  const keyLower = key.toLowerCase();

  // First check patterns to determine correct project
  let correctProject = 'uncategorized';
  for (const config of Object.values(PROJECT_MAPPING)) {
    for (const pattern of config.patterns) {
      if (pattern.test(filename) || pattern.test(keyLower)) {
        correctProject = config.folder;
        break;
      }
    }
    if (correctProject !== 'uncategorized') break;
  }

  // Check if already organized (in a project folder)
  const projectFolders = Object.values(PROJECT_MAPPING).map(p => p.folder);
  for (const folder of projectFolders) {
    if (keyLower.startsWith(`${folder}/`)) {
      // If it's in the correct folder, mark as already organized
      if (folder === correctProject) {
        return { project: folder, alreadyOrganized: true };
      }
      // If it's in the wrong folder, need to move it
      return { project: correctProject, alreadyOrganized: false, currentFolder: folder };
    }
  }

  // Not organized yet
  return { project: correctProject, alreadyOrganized: false };
}

/**
 * Copy an object to a new location
 */
async function copyObject(sourceKey, destinationKey) {
  const command = new CopyObjectCommand({
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${sourceKey}`,
    Key: destinationKey,
  });

  await s3Client.send(command);
}

/**
 * Delete an object
 */
async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Organize files into project folders
 */
async function organizeFiles(dryRun = DRY_RUN) {
  console.log(`\n🔍 Scanning S3 bucket: ${BUCKET_NAME}\n`);
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No files will be moved\n');
  }

  const objects = await listAllObjects();
  console.log(`📦 Found ${objects.length} objects\n`);

  const stats = {
    total: objects.length,
    alreadyOrganized: 0,
    toMove: 0,
    uncategorized: 0,
    byProject: {},
  };

  const moveOperations = [];

  // Analyze all files
  for (const obj of objects) {
    const { project, alreadyOrganized, currentFolder } = determineProject(obj.Key);
    
    if (alreadyOrganized) {
      stats.alreadyOrganized++;
      continue;
    }

    // If file is in a different project folder, remove the old folder prefix
    let newKey;
    if (currentFolder) {
      const pathWithoutFolder = obj.Key.substring(currentFolder.length + 1);
      newKey = `${project}/${pathWithoutFolder}`;
    } else {
      newKey = `${project}/${obj.Key}`;
    }
    
    if (project === 'uncategorized') {
      stats.uncategorized++;
    } else {
      stats.toMove++;
      moveOperations.push({
        oldKey: obj.Key,
        newKey: newKey,
        project: project,
        size: obj.Size,
      });
    }

    stats.byProject[project] = (stats.byProject[project] || 0) + 1;
  }

  // Display analysis
  console.log('📊 Analysis Results:');
  console.log('─'.repeat(50));
  console.log(`Total files:           ${stats.total}`);
  console.log(`Already organized:     ${stats.alreadyOrganized}`);
  console.log(`Files to move:         ${stats.toMove}`);
  console.log(`Uncategorized:         ${stats.uncategorized}`);
  console.log('\n📁 Files by project:');
  for (const [project, count] of Object.entries(stats.byProject)) {
    console.log(`  ${project}: ${count} files`);
  }

  // Show sample moves
  console.log('\n📝 Sample move operations (first 10):');
  console.log('─'.repeat(50));
  for (const op of moveOperations.slice(0, 10)) {
    console.log(`  ${op.oldKey}`);
    console.log(`  → ${op.newKey}\n`);
  }

  if (moveOperations.length > 10) {
    console.log(`  ... and ${moveOperations.length - 10} more\n`);
  }

  // Save report to file
  const report = {
    timestamp: new Date().toISOString(),
    bucket: BUCKET_NAME,
    stats,
    moveOperations,
  };

  const reportPath = join(__dirname, '..', 's3-organization-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`💾 Report saved to: s3-organization-report.json\n`);

  // Execute moves if not dry run
  if (!dryRun && moveOperations.length > 0) {
    console.log('🚀 Moving files...\n');
    let completed = 0;
    
    for (const op of moveOperations) {
      try {
        await copyObject(op.oldKey, op.newKey);
        await deleteObject(op.oldKey);
        completed++;
        
        if (completed % 10 === 0) {
          console.log(`  Moved ${completed}/${moveOperations.length} files...`);
        }
      } catch (error) {
        console.error(`❌ Error moving ${op.oldKey}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully moved ${completed} files!`);
  }

  return report;
}

/**
 * List uncategorized files for manual review
 */
async function listUncategorized() {
  console.log(`\n🔍 Listing uncategorized files in: ${BUCKET_NAME}\n`);
  
  const objects = await listAllObjects();
  const uncategorized = [];

  for (const obj of objects) {
    const { project, alreadyOrganized } = determineProject(obj.Key);
    
    if (project === 'uncategorized' && !alreadyOrganized) {
      uncategorized.push({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
      });
    }
  }

  if (uncategorized.length === 0) {
    console.log('✅ No uncategorized files found!\n');
    return;
  }

  console.log(`Found ${uncategorized.length} uncategorized files:\n`);
  for (const file of uncategorized) {
    console.log(`  📄 ${file.key}`);
    console.log(`     Size: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`     Modified: ${file.lastModified}\n`);
  }

  // Save to file
  const uncategorizedPath = join(__dirname, '..', 's3-uncategorized-files.json');
  await fs.writeFile(uncategorizedPath, JSON.stringify(uncategorized, null, 2));
  console.log(`💾 List saved to: s3-uncategorized-files.json\n`);
}

// CLI
const command = process.argv[2] || 'analyze';

(async () => {
  try {
    // Debug: Check what env vars are loaded
    console.log('AWS_ACCESS_KEY_ID present:', !!process.env.AWS_ACCESS_KEY_ID);
    console.log('AWS_SECRET_ACCESS_KEY present:', !!process.env.AWS_SECRET_ACCESS_KEY);
    
    // Check for AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('❌ Error: AWS credentials not found!');
      console.error('Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file\n');
      process.exit(1);
    }

    switch (command) {
      case 'analyze':
        await organizeFiles(true);
        break;
      case 'uncategorized':
        await listUncategorized();
        break;
      case 'execute':
        console.log('⚠️  Executing actual file moves...\n');
        await organizeFiles(false);
        break;
      default:
        console.log('Usage:');
        console.log('  npm run organize:s3           - Analyze files (dry run)');
        console.log('  npm run organize:s3 execute   - Execute file moves');
        console.log('  npm run organize:s3 uncategorized - List uncategorized files');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
})();
