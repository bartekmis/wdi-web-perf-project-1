const SectionKnowledgeTable = ({ data }: { data: any }) => {
  return (
    <section id={data.id} className='section section--article bg-lightGrey'>
      <div className='container-extra-small'>
        <div className='table-wrapper'>
          <table className='table'>
            {data.table_caption && (
              <caption
                className={`mb-4 ${
                  data.table_caption_alignment === 1
                    ? 'text-left'
                    : 'text-center'
                }`}
              >
                {data.table_caption}
              </caption>
            )}
            {!!data.table_headers?.length && (
              <thead>
                <tr>
                  {data.hide_headings && (
                    <th className='hidden' scope='col'>
                      {data.first_col_heading || ''}
                    </th>
                  )}
                  {!data.hide_headings && (
                    <th scope='col'>{data.first_col_heading || ''}</th>
                  )}
                  {data.table_headers.map((header: any, index: number) => {
                    return (
                      <th key={index} scope='col'>
                        {header.text}
                      </th>
                    );
                  })}
                </tr>
              </thead>
            )}
            {!!data.table_rows?.length && (
              <tbody>
                {data.table_rows.map((row: any, index: number) => {
                  return (
                    <tr key={index}>
                      {!data.hide_headings && (
                        <th scope='row'>{row.heading}</th>
                      )}
                      {!!row.columns?.length &&
                        row.columns.map((column: any, index: number) => {
                          return <td key={index}>{column.text}</td>;
                        })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </section>
  );
};

export default SectionKnowledgeTable;
