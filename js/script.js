// PDF Splitter''

const { PDFDocument } = PDFLib;

const pdfFile = document.getElementById("pdfFile");
const splitBtn = document.getElementById("splitBtn");
const totalPagesText = document.getElementById("totalPages");
const status = document.getElementById("status");

pdfFile.addEventListener("change", showTotalPages);
splitBtn.addEventListener("click", splitPDF);

// Show total pages when PDF is selected
async function showTotalPages() {
    const file = pdfFile.files[0];

    if (!file) {
        totalPagesText.textContent = "Total Pages: 0";
        return;
    }

    try {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        totalPagesText.textContent =
            `Total Pages: ${pdf.getPageCount()}`;

    } catch (error) {
        totalPagesText.textContent = "Invalid PDF";
    }
}

// Split PDF
async function splitPDF() {

    const file = pdfFile.files[0];
    const input = document.getElementById("pages").value.trim();

    if (!file) {
        alert("Please select a PDF.");
        return;
    }

    if (!input) {
        alert("Enter page numbers.");
        return;
    }

    status.textContent = "Processing...";

    try {

        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const totalPages = pdf.getPageCount();

        const selectedPages = parsePages(input, totalPages);

        if (selectedPages.length === 0) {
            alert("No valid pages found.");
            status.textContent = "";
            return;
        }

        for (const pageNumber of selectedPages) {

            const newPdf = await PDFDocument.create();

            const [page] = await newPdf.copyPages(pdf, [pageNumber - 1]);

            newPdf.addPage(page);

            const pdfBytes = await newPdf.save();

            downloadPDF(pdfBytes, `Page-${pageNumber}.pdf`);
        }

        status.textContent = "Split completed.";

    } catch (error) {

        console.error(error);

        status.textContent = "Error while splitting PDF.";

    }
}

// Convert page input into array
function parsePages(input, totalPages) {

    const result = [];

    const parts = input.split(",");

    parts.forEach(part => {

        part = part.trim();

        if (part.includes("-")) {

            const [start, end] = part.split("-").map(Number);

            for (let i = start; i <= end; i++) {

                if (i >= 1 && i <= totalPages) {
                    result.push(i);
                }

            }

        } else {

            const page = Number(part);

            if (page >= 1 && page <= totalPages) {
                result.push(page);
            }

        }

    });

    return [...new Set(result)];

}

// Download PDF
function downloadPDF(bytes, fileName) {

    const blob = new Blob([bytes], {
        type: "application/pdf"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}


document.getElementById("beautify").addEventListener("click", () => {

    const input = document.getElementById("input").value;

    const output = css_beautify(input, {
        indent_size: 4,
        indent_char: " ",
        end_with_newline: true,
        preserve_newlines: true,
        max_preserve_newlines: 2
    });

    document.getElementById("output").value = output;

});




const lineHeight = document.getElementById("lineHeight");

lineHeight.addEventListener("change", () => {
    const sel = window.getSelection();

    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    // Agar text select hai
    if (!range.collapsed) {
        const span = document.createElement("span");
        span.style.lineHeight = lineHeight.value;
        span.style.display = "inline-block";
        range.surroundContents(span);
    } else {
        // Agar cursor sirf ek paragraph me hai
        let node = sel.anchorNode;

        while (node && node.nodeType !== 1) {
            node = node.parentNode;
        }

        if (node) {
            node.style.lineHeight = lineHeight.value;
        }
    }
});




const editor = document.getElementById('editor');
const toolbar = document.getElementById('toolbar');
const blockFormat = document.getElementById('blockFormat');
const wordCount = document.getElementById('wordCount');

// Simple command buttons (bold, italic, lists, alignment, etc.)
toolbar.querySelectorAll('button[data-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    editor.focus();
    document.execCommand(btn.dataset.cmd, false, null);
    updateToolbarState();
  });
});

// Block format dropdown (paragraph / headings / quote)
blockFormat.addEventListener('change', () => {
  editor.focus();
  document.execCommand('formatBlock', false, blockFormat.value);
});

// Text color
document.getElementById('textColor').addEventListener('input', (e) => {
  editor.focus();
  document.execCommand('foreColor', false, e.target.value);
});

// Highlight / background color
document.getElementById('bgColor').addEventListener('input', (e) => {
  editor.focus();
  document.execCommand('hiliteColor', false, e.target.value);
});

// Link insertion
document.getElementById('linkBtn').addEventListener('click', () => {
  const url = prompt('Link URL daalein:', 'https://');
  if (url) {
    editor.focus();
    document.execCommand('createLink', false, url);
  }
});

// Highlight active formatting buttons (bold/italic/underline etc.) based on cursor position
function updateToolbarState() {
  ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList']
    .forEach(cmd => {
      const btn = toolbar.querySelector('button[data-cmd="' + cmd + '"]');
      if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
    });
}

editor.addEventListener('keyup', () => { updateToolbarState(); updateWordCount(); });
editor.addEventListener('mouseup', updateToolbarState);
editor.addEventListener('input', updateWordCount);

function updateWordCount() {
  const text = editor.innerText.trim();
  const words = text.length ? text.split(/\s+/).length : 0;
  wordCount.textContent = words + ' words';
}

// Export the editor's HTML content (e.g. to send to a backend)
document.getElementById('getHtmlBtn').addEventListener('click', () => {
  const html = editor.innerHTML;
  console.log(html);
  alert('HTML console mein print ho gaya hai (F12 se dekhein).\n\nPreview:\n' + html.slice(0, 300));
});

// Wrap editor content in a Word-compatible HTML shell.
// This is the standard, reliable way to export formatted content that Word opens natively -
// far more dependable than third-party HTML-to-docx conversion libraries.
function getWordHtml() {
  var parts = [];
  parts.push('<html xmlns:o="urn:schemas-microsoft-com:office:office" ');
  parts.push('xmlns:w="urn:schemas-microsoft-com:office:word" ');
  parts.push('xmlns="http://www.w3.org/TR/REC-html40">');
  parts.push('<head><meta charset="utf-8"><title>Document</title></head>');
  parts.push('<body>');
  parts.push(editor.innerHTML);
  parts.push('</body></html>');
  return parts.join('');
}

// Download as Word (.doc) — opens directly in Microsoft Word / LibreOffice / Google Docs with formatting intact
document.getElementById('downloadDocxBtn').addEventListener('click', () => {
  if (!editor.innerText.trim()) { alert('Pehle kuch likhein.'); return; }
  const html = getWordHtml();
  const blob = new Blob(
    [html],
    { type: 'application/msword;charset=utf-8' }
);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'document.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// Download as PDF
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  if (!editor.innerText.trim()) { alert('Pehle kuch likhein.'); return; }
  const opt = {
    margin: 0.6,
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(editor).save();
});

    // ==============================
// Find Text
// ==============================
document.getElementById("findBtn").addEventListener("click", function () {

const searchText = prompt("Find:");

if (!searchText) return;

editor.focus();

// Remove previous highlights
const html = editor.innerHTML.replace(
    /<span class="find-highlight">(.*?)<\/span>/gi,
    "$1"
);
editor.innerHTML = html;

// Highlight matches
const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");

editor.innerHTML = editor.innerHTML.replace(regex, function(match){
    return '<span class="find-highlight">' + match + '</span>';
});

});

// ==============================
// Replace Text
// ==============================
document.getElementById("replaceBtn").addEventListener("click", function () {

const searchText = prompt("Find:");
if (!searchText) return;

const replaceText = prompt("Replace With:");
if (replaceText === null) return;

const regex = new RegExp(
    searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi"
);

editor.innerHTML = editor.innerHTML.replace(regex, replaceText);

});

document.getElementById("fontSize").addEventListener("change", function () {
    document.execCommand("fontSize", false, this.value);
});


document.getElementById("fontFamily").addEventListener("change", function () {
    document.execCommand("fontName", false, this.value);
});