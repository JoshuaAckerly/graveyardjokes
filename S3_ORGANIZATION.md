# S3 Image Organization Guide

This guide explains how to organize images in your S3 bucket by project/repository.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Credentials

Add your AWS credentials to [.env](.env):

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=graveyardjokes-cdn
```

### 3. Configure Project Mappings

Edit [scripts/organize-s3-images.mjs](scripts/organize-s3-images.mjs) to customize the project mappings:

```javascript
const PROJECT_MAPPING = {
  graveyardjokes: {
    patterns: [
      /graveyardjokes/i,
      /graveyard.*jokes/i,
      /jokes/i,
      /cemetery/i,
      /tombstone/i,
      /halloween/i,
    ],
    folder: 'graveyardjokes',
  },
  // Add more projects here:
  anotherproject: {
    patterns: [/anotherproject/i, /another/i],
    folder: 'anotherproject',
  },
};
```

## Usage

### Analyze Files (Dry Run)

Run this first to see what the script will do without making any changes:

```bash
npm run organize:s3
```

This will:
- Scan all files in your S3 bucket
- Categorize them by project based on filename patterns
- Generate a report showing what files would be moved
- Save the report to `s3-organization-report.json`

### List Uncategorized Files

To see files that couldn't be automatically categorized:

```bash
npm run organize:s3:uncategorized
```

This creates `s3-uncategorized-files.json` with all files that need manual categorization.

### Execute Organization

Once you've reviewed the dry run report and are ready to organize:

```bash
npm run organize:s3:execute
```

⚠️ **Warning**: This will actually move files in your S3 bucket!

## How It Works

1. **Scanning**: Lists all objects in the S3 bucket
2. **Categorization**: Matches filenames against project patterns
3. **Organization**: Copies files to `{project-name}/{original-filename}`
4. **Cleanup**: Deletes original file after successful copy

### File Structure After Organization

```
s3://graveyardjokes-cdn/
├── graveyardjokes/
│   ├── image1.jpg
│   ├── logo.png
│   └── background.webp
├── anotherproject/
│   ├── hero.jpg
│   └── banner.png
└── uncategorized/
    └── unknown-file.jpg
```

## Customization

### Adding New Project Patterns

1. Open [scripts/organize-s3-images.mjs](scripts/organize-s3-images.mjs)
2. Add a new entry to `PROJECT_MAPPING`:

```javascript
newproject: {
  patterns: [
    /newproject/i,           // Matches "newproject" (case-insensitive)
    /new.*project/i,         // Matches "new-project", "newProject", etc.
    /specific-file-name/i,   // Specific filename
  ],
  folder: 'newproject',      // Folder name in S3
},
```

### Changing Dry Run Mode

In the script, modify the `DRY_RUN` constant:

```javascript
const DRY_RUN = true;  // Set to false to execute moves
```

## Troubleshooting

### AWS Credentials Error

```
❌ Error: AWS credentials not found!
```

**Solution**: Make sure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set in your `.env` file.

### Permission Errors

**Solution**: Ensure your AWS IAM user has the following permissions:
- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`
- `s3:CopyObject`

### Files Not Being Categorized

**Solution**: Check the patterns in `PROJECT_MAPPING`. You may need to add more specific patterns or review the uncategorized files list.

## Reports

### s3-organization-report.json

Contains:
- Timestamp
- Statistics (total files, files to move, etc.)
- Complete list of move operations

### s3-uncategorized-files.json

Contains:
- List of files that couldn't be automatically categorized
- File sizes and last modified dates

## Safety Features

- **Dry Run by Default**: Always runs in dry run mode first
- **Reports**: Generates detailed reports before making changes
- **Copy-Then-Delete**: Copies files first, only deletes if copy succeeds
- **Error Handling**: Continues processing even if individual files fail

## Next Steps

1. Run `npm run organize:s3` to analyze your bucket
2. Review the `s3-organization-report.json`
3. Check `s3-uncategorized-files.json` for files needing manual review
4. Update patterns in the script if needed
5. Run `npm run organize:s3:execute` to organize files
