let transformedData = [];

document.getElementById('upload').addEventListener('change', handleFile, false);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const values = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat();

    const chunkSize = parseInt(document.getElementById('chunkSize').value, 10) || 17;

    transformedData = [];

    for (let i = 0; i < values.length; i += chunkSize) {
      transformedData.push(values.slice(i, i + chunkSize));
    }

    alert("✅ File processed! Click 'Download Transformed Excel' to get your file.");
  };

  reader.readAsArrayBuffer(file);
}

function downloadTransformed() {
  if (transformedData.length === 0) {
    alert("⚠️ Please upload a file first!");
    return;
  }

  const newSheet = XLSX.utils.aoa_to_sheet(transformedData);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Transformed');

  XLSX.writeFile(newWorkbook, 'transformed_output.xlsx');
}
