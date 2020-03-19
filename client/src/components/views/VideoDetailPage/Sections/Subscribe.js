import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Subscribe({ userTo, userFrom }) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);
  const [Toggle, setToggle] = useState(false);

  useEffect(() => {
    console.log('userTo (props): ', userTo);
    let variable = { userTo };
    Axios.post('/api/subscribe/subscribeNumber', variable).then(res => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
        console.log('SubNumber: ', SubscribeNumber);
      } else {
        alert('구독자 수 정보를 받아오지 못했습니다.');
      }
    });

    let subscribedVariable = {
      userTo,
      userFrom,
    };

    Axios.post('/api/subscribe/subscribed', subscribedVariable).then(res => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
        // console.log(
        //   res.data.subscribe,
        //   'SUBSCRIBED: ',
        //   res.data.subscribed,
        //   'onlineUser: ',
        //   res.data.onlineUser,
        //   'SubUser: ',
        //   res.data.subUser,
        //   'CheckSubs: ',
        //   res.data.checkSubs,
        // );
      } else {
        alert('정보를 받아오지 못했습니다.');
      }
    });
  }, []);

  const onSubscribe = async () => {
    setToggle(prevToggle => !prevToggle);
    // const toggle = async () => {
    //   await setToggle(prevToggle => !prevToggle);
    // };

    // toggle();

    let subscribedVariable = {
      userTo,
      userFrom,
    };
    // 이미 구독중이라면
    if (Subscribed) {
      const unSubsData = await Axios.post(
        '/api/subscribe/unsubscribe',
        subscribedVariable,
      );
      if (unSubsData.data.success) {
        setSubscribeNumber(prevSubscribeNumber => prevSubscribeNumber - 1);
        setSubscribed(prevSubscribed => !prevSubscribed);
        // console.log('Toggle: ', Toggle);
      } else {
        alert('구독 취소 요청을 실패했습니다.');
      }
    } else {
      // 구독중이 아니라면
      const subsData = await Axios.post(
        '/api/subscribe/subscribe',
        subscribedVariable,
      );
      if (subsData.data.success) {
        setSubscribeNumber(prevSubscribeNumber => prevSubscribeNumber + 1);
        setSubscribed(prevSubscribed => !prevSubscribed);
        // console.log('Toggle: ', Toggle);
      } else {
        alert('구독 요청을 실패했습니다.');
      }
    }
    // toggle();
    setToggle(prevToggle => !prevToggle);
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
          borderRadius: '4px',
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
        }}
        onClick={!Toggle ? onSubscribe : undefined}
        // onClick={!Toggle && onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscribe;
