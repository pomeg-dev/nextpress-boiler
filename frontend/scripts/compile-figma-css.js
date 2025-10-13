const sass = require('sass');
const fs = require('fs');
const path = require('path');

async function compileFigmaCSS() {
  try {
    const stylesDir = path.join(__dirname, '../ui/styles');
    
    // Check if styles directory exists
    if (!fs.existsSync(stylesDir)) {
      console.log('Styles directory not found, skipping compilation...');
      return;
    }
    
    // Find all figma-variables*.css files
    const files = fs.readdirSync(stylesDir);
    const scssFiles = files.filter(file => 
      file.startsWith('figma-variables') && file.endsWith('.css')
    );
    
    if (scssFiles.length === 0) {
      console.log('No figma-variables SCSS files found, skipping compilation...');
      return;
    }
    
    console.log(`Found ${scssFiles.length} figma-variables SCSS files to compile...`);
    
    for (const scssFile of scssFiles) {
      const scssFilePath = path.join(stylesDir, scssFile);
      
      // Compile SCSS to CSS
      const result = sass.compile(scssFilePath, {
        style: 'compressed',
        loadPaths: [stylesDir]
      });
      
      // Extract just the CSS content
      let cssContent = result.css;
      
      // Convert to JavaScript string format for inline styles
      const cssAsJsString = JSON.stringify(cssContent);
      
      // Generate variable name and output filename based on input filename
      const baseName = path.basename(scssFile, '.css');
      const variableName = baseName.replace(/-([a-z])/g, (match, letter) => 
        letter.toUpperCase()
      ) + 'CSS';
      
      // Create TypeScript file with compiled CSS
      const tsContent = `// Auto-generated from ${scssFile}
export const ${variableName} = ${cssAsJsString};
`;
      
      const outputPath = path.join(__dirname, `../src/lib/${baseName}.css.ts`);
      fs.writeFileSync(outputPath, tsContent, 'utf-8');
      
      console.log(`✅ ${scssFile} compiled to CSS and saved to src/lib/${baseName}.css.ts`);
      console.log(`📊 CSS size: ${(cssContent.length / 1024).toFixed(2)}KB`);
    }
    
  } catch (error) {
    console.error('❌ Error compiling Figma CSS:', error);
  }
}

compileFigmaCSS();