const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/components').concat(walk('./src/store'));
files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import\s+\{([^}]*Link[^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';");
    content = content.replace(/import\s+\{([^}]*useNavigate[^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
    
    // Convert useNavigate hook
    content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, "const router = useRouter();");
    content = content.replace(/navigate\(/g, "router.push(");

    // Add "use client" if it uses hooks
    if (content.match(/use(State|Effect|Cart|Router|Store)/) || content.includes('create(')) {
      if (!content.includes('"use client"')) {
        content = '"use client";\n' + content;
      }
    }
    fs.writeFileSync(file, content);
  }
});
