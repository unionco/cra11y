import React from 'react';
import Highlight from 'react-highlight';
import './styles.scss';

interface CodeProps {
  code: string,
  lang?: string
}

const Code: React.FunctionComponent<CodeProps> = (props) => {
  const { code, lang } = props;

  return (
    <div className="code">
      <Highlight className={'language-' + lang}>
        {code}
      </Highlight>
    </div>
  );
};

Code.defaultProps = {
  code: '',
  lang: 'html'
};

export default Code;
