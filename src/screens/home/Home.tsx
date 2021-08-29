import React from 'react';
import Header from '@layout/header';
import FolderSelection from '@layout/folder_selection';

import './Home.less';

type Props = {};

const Home: React.FC<Props> = () => {
  return (
    <>
      <Header />
      <div className="">
        <FolderSelection />
      </div>
    </>
  );
};

export default Home;
