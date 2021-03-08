export const bulkToLeadObject = file => {
  const bulkData = file.buffer.toString();
  const rows = bulkData.split('\r\n');
  const leads = [];
  for (const row of rows) {
    const rowArray = row.split(',');
    leads.push({
      name: rowArray[0],
      family_name: rowArray[1],
      email: rowArray[2],
      cellphone: rowArray[3],
    });
  }
  return leads;
};
