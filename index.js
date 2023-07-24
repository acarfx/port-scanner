const net = require('net');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Ports = {
    21: 'FTP',
    22: 'SSH',
    23: 'TELNET',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    8080: 'HTTP/2',
    8081: 'HTTP/3',
    8082: 'HTTP/4',
    3000: 'API',
    5000: 'API',
    110: 'POP3',
    115: 'SFTP',
    135: 'RPC',
    139: 'NetBIOS',
    143: 'IMAP',
    194: 'IRC',
    443: 'SSL',
    445: 'SMB',
    1433: 'MSSQL',
    3306: 'MySQL',
    5432: 'PostgreSQL',
    3389: 'Remote Desktop',
    5900: 'VNC',
    27017: "MongoDB",
  
};
  

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/api/process/:ip', async (req, res) => {
     let CheckPorts =  Object.keys(Ports).map((port) => parseInt(port));
  
     scanPorts(req.params.ip,  CheckPorts)
    
      .then((openPorts) => {
        res.status(200).send({
            success: true,
            message: "Başarıyla port taraması gerçekleştirildi.",
            ...openPorts
        })
      })
    
      .catch((err) => {
       res.status(200).send({success: false, message: "Hata oluştu!", error: err})
      });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



  function scanPort(targetIp, port) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(100);
      socket.on('connect', () => {
        socket.destroy();
        resolve(Ports[port]);
      });
      socket.on('timeout', (err) => {
          socket.destroy();
          resolve(null);
      });
      socket.on('error', (err) => {
        socket.destroy();
        resolve(null);
      });
  
      socket.connect(port, targetIp);
    });
  }
  
  async function scanPorts(targetIp, portsToScan) {
    const openPorts = [];
    const denyPorts = []
    for (const port of portsToScan) {
      const serviceName = Ports[port] || 'Bilinmeyen';
  
  
      const serviceNameIfOpen = await scanPort(targetIp, port);
  
      if (serviceNameIfOpen) {
        openPorts.push({ port, service: serviceNameIfOpen });
      } else {
        denyPorts.push(port);
      }
    }
  
    return {
        ip: targetIp,
        host: targetIp,
        date: Date.now(),
        _service: "Port Scanner",
        _allowservice: openPorts,
        _deny: denyPorts,
        _allow: openPorts.map(x => x.port)
    };
  }
  
