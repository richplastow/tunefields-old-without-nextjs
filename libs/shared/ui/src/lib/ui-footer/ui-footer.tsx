/* eslint-disable-next-line */
export interface UiFooterProps {}

export function UiFooter(props: UiFooterProps) {
  return (
    <div className="ui-footer">
      <style jsx>{`
        .ui-footer {
          color: green;
        }
      `}</style>
      <h1>UiFooter Here</h1>
    </div>
  );
}

export default UiFooter;
