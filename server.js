const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();   
app.use(express.json());     
app.use(cors());        
  
// Connect to MongoDB  
mongoose.connect('mongodb://localhost:27017/invoice-app') 
  .then(() => {
    console.log("DB connected");
  }) 
  .catch((err) => {
    console.log(err);     
  });  

// Define the Invoice Schema
const invoiceSchema = new mongoose.Schema({
  title: {
    required: true,  
    type: String
  },
  description: String,
  amount: {
    required: true,
    type: Number
  },
  dueDate: {
    required: true,
    type: Date
  }
});

const invoiceModel = mongoose.model('Invoice', invoiceSchema);

// Create a new invoice
app.post('/invoices', async (req, res) => {
  const { title, description, amount, dueDate } = req.body;

  try {
    const newInvoice = new invoiceModel({ title, description, amount, dueDate });
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    console.log(error);  
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices
app.get('/invoices', async (req, res) => {
  try {
    const invoices = await invoiceModel.find();
    res.json(invoices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}); 

// Update an invoice
app.put('/invoices/:id', async (req, res) => {
  const { title, description, amount, dueDate } = req.body;
  const id = req.params.id;

  try {
    const updatedInvoice = await invoiceModel.findByIdAndUpdate(
      id,
      { title, description, amount, dueDate },
      { new: true }
    );
    
    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }  
 
    res.json(updatedInvoice);  
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete an invoice
app.delete('/invoices/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await invoiceModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});   

const port = 8000;
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
