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