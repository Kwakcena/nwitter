import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';

import Nweet from 'components/Nweet';

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    // onSnapshot은 nweets 데이터 베이스에 어떤 일이 발생했을 경우 발생.
    dbService.collection('nweets').onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map(doc => ({
        id:doc.id, 
        ...doc.data(),
      }));
      setNweets(nweetArray);
    })
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault();
    // nweets 라는 콜렉션에 데이터를 저장한다.
    await dbService.collection('nweets').add({
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet('');
  }

  const onChange = (event) => {
    const {
      target: {
        value,
      }
    } = event;

    setNweet(value);
  }

  return (
    <>
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        onChange={onChange} 
        value={nweet} 
        placeholder="What's on your mind" 
        maxLength={120} 
      />
      <input 
        type="submit" 
        value="Nweet" 
      />
    </form>
    <div>
      {nweets.map(nweet => (
        <Nweet 
          key={nweet.id} 
          nweetObj={nweet} 
          isOwner={nweet.creatorId === userObj.uid}
        />
      ))}
    </div>
    </>
  )
} 
export default Home;