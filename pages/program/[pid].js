import { useRouter } from "next/router"
import axios from "axios"
import useSWR from "swr"
import { useMessengerSDK } from '../../hooks'
const fetcher = (url) => axios.get(url).then((res) => res.data);
const Program = () => {
  const sdk = useMessengerSDK()
  const router = useRouter();
  const { pid, cid } = router.query;
  // console.log(router);
  const { data, error } = useSWR(
    pid && `https://awoo.gq/programs/${pid}`,
    fetcher
  );
  const onSetReminder = () => {
    sdk(extensions => {
      console.log(extensions)
      axios.post(`https://twotwo.cf/conversations/${cid}/trigger_intent?output_channel=facebook`, { "name": "EXTERNAL_set_reminder", "entities": { "program_id": pid } }, { headers: { "content-type": "application/json" } }).then(() => extensions.requestCloseBrowser(function success() {
        window.close()
      }, function error(e) { window.top.close() })
      )
    })
  }
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  if (data) {
    return (
      <div className="body">
        <img src={`https://awoo.gq${data.image.formats.medium.url}`} />
        <div className="textContainer">
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <button className="footer" onClick={onSetReminder}>Đặt lịch</button>
        </div>
        <style jsx>
          {`
            .body {
              display: flex;
              flex-direction: column;
            }

            .textContainer {
              display: flex;
              flex-direction: column;
              margin: 5px 5px;
            }

            img {
              width: 100%;
            }
            .footer {
              position: fixed;
              left: 0;
              bottom: 0;
              width: 100%;
              text-align: center;
            }
          `}
        </style>
      </div>
    );
  }
};

export default Program;
