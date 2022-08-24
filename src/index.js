const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();
const { v4: uuidv4 } = require('uuid');
const User = require('./models/users');
const Payment = require('./models/payment');

MercadoPago.configure({
    sandbox: true,
    access_token: process.env.TOKEN
});

app.get('/user', async (req, res) => {
    await User.create({name:'fulano', email:'fulano@yahoo.com'});
    return res.status(200).json({success: 'cadstrado'});
});

app.get('/', (req, res) => {
    res.send('Olá Mundo');
});

app.get('/pagar/:id', async (req, res) => {
    const { id } = req.params;
    // pagamentos 
    // id // codigo // pagados // status
    // 1 // 34092840289042 // pagador // idUsuario // não foi pago
    // 2 // 90459043959439 // pagado //  idUsuario // foi pago
    const  users = await User.findById(id);

    var idUser = uuidv4();
    var email = users.email;

   let dados = {
       items: [
           item = {
               id: idUser,
               title: 'Produto acesso',
               quantity:1,
               currency_id: 'BRL',
               unit_price: parseFloat(20)
           }
       ],
       payer: {
           email
       },
       external_reference:idUser
   }

   try {
        if(users) {
            var pagamento = await MercadoPago.preferences.create(dados);
        }
        
        await Payment.create({codigo: idUser, id_payment: id, pagador:email});
        return res.redirect(pagamento.body.init_point);
   }catch(err) {
       return res.send(err.message);
   }
 
  
});

app.post('/noti', (req, res) => {
   const { id } = req.query;
    console.log(id, 'titlecomo a')
     setTimeout(() => {
        let filtro = { "order.id" : id };
        MercadoPago.payment.search({
            qs: filtro
        }).then( data  => {
            let pagamento = data.body.results[0];
           if(pagamento !== undefined) {
               if(pagamento.status === 'approved') {
                   let payment = Payment.findOneAndUpdate({codigo:  pagamento.external_reference }, { status:'approved' }, {new:true}).then((dados) => {
                      return dados;
                   }).then( (dados) => {
                        User.findOneAndUpdate({ _id: dados.id_payment}, { payment:true }, {new:true}).then((stado) => {
                            console.log(stado);
                            console.log('atulizado');
                        });
                   } );
                   
               }
           }
        })
     }, 20000);


   return res.status(200).send('ok');
});

app.listen(process.env.PORT || 3002, () => console.log('running app'));