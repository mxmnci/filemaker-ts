export async function deleteAll() {
  await client.find.find({
    query: [{ name: '*' }],
  });
  const records = response.response.data;
  for (const record of records) {
    await client.records.deleteRecord(record.recordId);
  }
}
