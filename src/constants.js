// constants.js

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  c: "10.2.0",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const CODE_SNIPPETS = {
  javascript: 'console.log("Hello, World!");',
  typescript:
    'const greet = (name: string): string => {\n\treturn `Hello, ${name}!`;\n};\n\nconsole.log(greet("World"));',
  python:
    'def main():\n\tprint("Hello, World!")\n\nif __name__ == "__main__":\n\tmain()',
  java: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
  csharp:
    'using System;\n\nclass Program {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello, World!");\n\t}\n}',
  php: '<?php\n// PHP Boilerplate\n\necho "Hello, World!";\n?>',
  c: '#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!\\n");\n\treturn 0;\n}',
};
