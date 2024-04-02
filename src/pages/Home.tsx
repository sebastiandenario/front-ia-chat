import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem, IonGrid, IonRow, IonCol, IonAvatar, IonText, IonSpinner } from '@ionic/react';
import './Home.css';
import { getApiData, postApiData } from "../shared/services/api/apiService";
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import Table from "../shared/components/table/Table";
import ReactMarkdown from 'react-markdown';


const Home: React.FC = () => {

  const inputRef: any = useRef();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string, message: string, date: string, add_type: string, add_data?: any, add_images?: any, messageEnd?: string }[]>([]);
  const [sequence, setSequence] = useState(1);
  const [botTyping, setBotTyping] = useState(false);

  useEffect(() => {
    getApiData('v1/chat/init')
      .then(data => {
        console.log('bot response: ', data);
        setMessages([data]);
      })
      .catch(error => console.error(error));

    showTable([
      { Asunto: 'TFV', Visitas: 30 },
      { Asunto: 'Visitas', Visitas: 160 }
    ]);

  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value;
    if (!message.trim()) {
      return;
    }

    setSequence(sequence + 1);
    const newMessage = {
      user: 'Juan',
      message: message,
      date: new Date().toISOString(),
      add_type: '',
      sequence: sequence
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    console.log('user message:', newMessage);
    inputRef.current!.value = '';
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.user === 'Juan') {
      sendMessageApi(lastMessage);
    }
  }, [messages]);

  async function sendMessageApi(message: any) {
    setBotTyping(true);
    await postApiData('v1/chat/clientMessage', message)
      .then(data => {
        console.log('bot response: ', data);
        if (data.add_type === 'table') {
          showTable(data);
        }
        setMessages([...messages, data]);
      })
      .catch(error => console.error(error));
    setBotTyping(false);
  }

  function showTable(data: any) {
    console.table('showTable: ', data);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonItem lines='none'>
            <IonAvatar slot='start'>
              <img src={"img/bot.avif"} />
            </IonAvatar>
            <IonTitle>Chat EssBot</IonTitle>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid fixed>
          <IonRow>
            <IonCol size="12">
              <IonList>
                {messages.map((message, index) => (
                  <IonItem key={`IonItem-${index}`} lines='none' style={{ marginTop: '10px' }}>
                    <IonAvatar slot={message.user === 'Bot' ? 'start' : 'end'}>
                      <img src={message.user === 'Bot' ? "img/bot.avif" : "img/person.avif"} />
                    </IonAvatar>
                    {/* <div style={{width: '100%', padding: '15px 10px ', borderRadius: '10px', backgroundColor: '#48C6ED'}}> */}
                    <div style={{ width: '70%', padding: '5px 20px', borderRadius: '20px', backgroundColor: message.user === 'Bot' ? '#48C6ED' : '#F8F8F8', marginLeft: message.user === 'Bot' ? '10px' : 'auto', marginRight: message.user === 'Bot' ? 'auto' : '10px', position: 'relative' }}>
                      <p style={{ position: 'relative', color: message.user === 'Bot' ? 'white' : 'black' }}>
                        {/* <IonText slot='start' color={message.user === 'Bot' ? 'primary' : 'success'} style={{ position: 'absolute', top: '0', fontWeight: 'bold' }}>{message.user}</IonText> */}
                        <IonText slot='start' style={{ fontWeight: 'bold' }}>{message.user}<br></br></IonText>
                        {message.message.split('\n').map((line, i) => (
                          <span key={i}>
                            {line.trim()}
                            <br />
                          </span>
                        ))}
                      </p>

                      {message.add_type === 'tables' &&
                        message.add_data.map((table: any, i: any) => (
                          <div key={`table-${i}`} style={{ overflowX: 'auto' }}>
                            <Table data={table} tableStyle={{ minWidth: '600px' }} />
                          </div>
                        ))
                      }

                      {message.add_type === 'images' && (
                        message.add_images.map((image: any, i: any) => (
                          <img key={`image-${i}`} src={image} style={{ width: '100px', height: '100px' }} />
                        ))
                      )}

                      {/* {message.messageEnd && (
                        <p>
                          <IonText slot='start' color={message.user === 'Bot' ? 'primary' : 'secondary'} style={{ position: 'absolute', top: '0', fontWeight: 'bold' }}>{message.user}</IonText>
                          {message.messageEnd.split('\n').map((line, i) => (
                            <span key={i}>
                              {line.trim()}
                              <br />
                            </span>
                          ))}
                        </p>
                      )} */}

                      {/* {message.messageEnd && (
                        <div style={{ overflow: 'auto', whiteSpace: 'normal', width: '100%' }}>
                          <IonText slot='start' color={message.user === 'Bot' ? 'primary' : 'secondary'} style={{ position: 'absolute', top: '0', fontWeight: 'bold' }}>{message.user}</IonText>
                          <ReactMarkdown>
                            {message.messageEnd}
                          </ReactMarkdown>
                        </div>
                      )} */}
                      <small slot='start'>{format(new Date(message.date), 'HH:mm')}</small>

                    </div>

                    {/* <small slot='end'>{format(new Date(message.date), 'HH:mm')}</small> */}

                  </IonItem>
                ))}

                {botTyping && (
                  <IonItem>
                    <IonAvatar slot='start'>
                      <img src={"img/bot.avif"} />
                    </IonAvatar>
                    <p>
                      <IonText slot='start' color='primary' style={{ position: 'absolute', top: '0', fontWeight: 'bold' }}>Bot</IonText>
                      <IonSpinner name="dots"></IonSpinner>
                    </p>
                  </IonItem>
                )}

              </IonList>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <IonItem style={{ flex: 1, borderRadius: '10px', border: '1px solid' }}>
                  <IonInput
                    ref={inputRef}
                    onIonChange={e => e.detail.value && setMessage(e.detail.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Enter Message"
                  />
                </IonItem>
                <IonButton mode='ios' onClick={sendMessage} style={{ marginLeft: '10px' }}>Send</IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
