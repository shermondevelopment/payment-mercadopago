const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();
const { v4: uuidv4 } = require('uuid');
const User = require('./models/users');
const Payment = require('./models/payment');

MercadoPago.configure({
    sandbox: true,
    access_token:'TEST-2500240343681877-112117-92415a6b3365dc88ac30048c7996f90f-269366342'
});

app.get('/user', async (req, res) => {
    await User.create({name:'fernanda', email:'fernanda@yahoo.com'});
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
        
        await Payment.create({id_payment: id, pagador:email});
        return res.redirect(pagamento.body.init_point);
   }catch(err) {
       return res.send(err.message);
   }
 
  
});

app.post('/noti', async (req, res) => {
   const { id } = req.query;
   console.log(id)
   setTimeout(async () => {
    var filtro = {  
        "order.id" : id
    }
    const pags = await MercadoPago.payment.search({
        qs: filtro
    });


    let pagamento = pags.body.results[0];
    console.log(pagamento);
    // if(pagamento !== undefined) {
    //     if(pagamento.status === 'approved') {
    //         await Payment.findByIdAndUpdate({id_payment: id}, { status: 'approved' });
    //         await User.findByIdAndUpdate(id, { status:true });
    //         console.log('pagamento approvado')
    //     }
    // }
    // MercadoPago.payment.search({
    //     qs: filtro
    // }).then(data=> {
    //     let traba = data.body.results[1];
    //     let pagamento = data.body.results[0];
    //     console.log(traba);
    //     console.log(pagamento);
    //     if(pagamento !== undefined) {
    //         if(pagamento.status === 'approved') {
    //             Payment.update({status: 'approved'}, { where: {id_payment: id} }).then((result) => {
    //                 console.log('atualizado');
    //             })
    //         }
    //     } else {
    //         console.log('pagamento invalido');
    //     }
    // }).catch(err=> {
    //   console.log(err);
    // })
   }, 20000);
   return res.status(200).send('ok');
});

app.listen(process.env.PORT || 3002, () => console.log('running app'));