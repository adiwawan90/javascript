const StorageCtrl = (function(){ // variabellocal storae

    return {
        paketKursus: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items))
            }else{

                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromStorage: function(){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index,1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        }, 
        clearItemFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

const ItemCtrl = (function(){
    //membuat constructor objek
    //variabel yg mempunyai method
    const Item = function(id, nama, harga){
        this.id = id;
        this.nama = nama;
        this.harga = harga;
    }

    //membuat variabel yang akan ditampilkan ke browser berisi list/array
    const data = {
        // items : [
        //     // {id: 0, nama: 'SEO', harga: 120000},
        //     // {id: 1, nama: 'JavaScript', harga: 150000},
        //     // {id: 2, nama: 'ReactJs', harga: 175000}
        // ],

        items: StorageCtrl.getItemsFromStorage(),

        currentItem: null,
        totalHarga: 0 // ini nilai awal
    }


    return {
        getItems: function(){
            return data.items;
        },  
        addItem: function(nama, harga){
            // console.log(nama, harga);
            let ID;

            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id +   1 ;
            }else{
                ID = 0;
            }

            harga = parseInt (harga);

            const newItem = new Item(ID, nama, harga);

            data.items.push(newItem);

            return newItem;
        },

        getItemsById: function(id){
            // untuk buat id
            let found = null;

            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function (nama, harga){
            harga = parseInt(harga);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.nama = nama;
                    item.harga = harga;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id){
            //get id
            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);

            data.items.splice(index,1);
        },
        clearAllItem: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalHarga : function(){
            let total = 0;
            //looping items dan tambah class
            data.items.forEach(function(item){
                total += item.harga;
               
            }); 
            //set total harga
            data.totalHarga = total;
            //mengembalikan nilai totalharga    
            return data.totalHarga;
        },

        logData: function(){
            return data;
        }
    }
})();

//membuat UI controller, yg akan ditampilkan
const UICtrl = (function(){        

    const UISelector ={
        itemList: '#item-list',
        addBtn: '.add-btn',
        listItem: '#item-listx li',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        itemNamaPaket: '#nama-paket',
        itemHargaPaket: '#harga-paket',
        totalHarga: '.total-harga'
    }

    //ini menampilkan data dr Item
    return {
        
        populateItemList: function(items){
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.nama}: </strong><em>Rp. ${item.harga}</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`;
            });

            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        //membuat methode mengambilinputan
        getItemsInput: function(){
            return {
                nama: document.querySelector(UISelector.itemNamaPaket).value,
                harga: document.querySelector(UISelector.itemHargaPaket).value
            }
        },
        addListItem: function(item){

            document.querySelector(UISelector.itemList).style.display = 'block';
            const li = document.createElement('li');

            li.className = 'collection-item';
            
            li.id = `item-${item.id}`;

            li.innerHTML = `<strong>${item.nama}: </strong><em>Rp. ${item.harga}</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item                                                                                                         fa fa-pencil"></i>
                        </a>`;

            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li);

        },

        //ketika data berhasil update lalu ditampilkan
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelector.listItems);

            listItems = Array.from(listItems)
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <li class="collection-item" id="item-${item.id}">
                    <strong>${item.nama}: </strong><em>Rp. ${item.harga}</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                    </li>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;

            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function (){
            document.querySelector(UISelector.itemNamaPaket).value = '';
            document.querySelector(UISelector.itemHargaPaket).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelector.itemNamaPaket).value = ItemCtrl.getCurrentItem().nama;
            document.querySelector(UISelector.itemHargaPaket).value = ItemCtrl.getCurrentItem().harga;

            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelector.listItems)

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },

        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showTotalHarga:function(totalHarga){
            document.querySelector(UISelector.totalHarga).textContent = totalHarga;
        },
        //ketika data berhasil diinput, botton update akan display none.
        clearEditState: function(){
            UICtrl.clearInput();//
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },

        showEditState: function(){
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        //membuat ketika button diklik;
        getSelectors: function(){
            return UISelector;
        }

    }
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    // membuat VARIABEL UTK NGELOdeleteAD EVENT YG KITA LAKUKAN
    const loadEventListeners = function(){
        const UISelector = UICtrl.getSelectors();
        //simpn data
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);
        //agar tombol enter tidak fungsi
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
    });
    //edit click data insert to form
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);
    //update data
        document.querySelector(UISelector.updateBtn).addEventListener('click',itemUpdateSubmit);
    //delete button
    document.querySelector(UISelector.deleteBtn).addEventListener('click',itemDeletesubmit);

    //back button event
    document.querySelector(UISelector.backBtn).addEventListener('click',UICtrl.clearEditState);

    document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemClick);
    }

    const itemAddSubmit= function(e){
        const input = UICtrl.getItemsInput();
        // console.log(input)
        //buat kodisi, jika datanya ada apa yang mau dilakukan
        if(input.nama !== '' && input.harga!== ''){
            const newItem = ItemCtrl.addItem(input.nama, input.harga);

            UICtrl.addListItem(newItem);

            const totalHarga = ItemCtrl.getTotalHarga();
            // total harga yg akan ditampilkan ke use
            //add total harga to UIitemUpdateSubmit
            UICtrl.showTotalHarga(totalHarga);

            StorageCtrl.paketKursus(newItem);

            UICtrl.clearInput();
            // console.log(newItem)
        }
        
        e.preventDefault();
    }
    // untuk klik data berdasarkan id
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //meambil list item id
            const listId = e.target.parentNode.parentNode.id;
            //membuat string kedalam sebuah array dipisah dengan dash
            const listIdArr = listId.split('-');
            //ambil id yg sebenarnya
            const id = parseInt(listIdArr[1]);
            //mengambil item
            const itemToEdit = ItemCtrl.getItemsById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //update data
    const itemUpdateSubmit = function(e){
        // mengambilnilai inputan
        const input = UICtrl.getItemsInput();

        const updatedItem = ItemCtrl.updateItem(input.nama, input.harga);
        //update data yg ada di UI controler / browser
        UICtrl.updateListItem(updatedItem);
        //ubah data saat di update
        const totalHarga = ItemCtrl.getTotalHarga();

        UICtrl.showTotalHarga(totalHarga);
        
        StorageCtrl.updateItemStorage(updatedItem);
        //menhilangkan kolom saat terupdate
        UICtrl.clearEditState();

        e.preventDefault();

    }

    //delete event botton
    const itemDeletesubmit = function(e){
        //untuk mengambil item yg akan dihapus
        const currentItem = ItemCtrl.getCurrentItem();
        //hapus struktur data berdasarjkan id
        ItemCtrl.deleteItem(currentItem.id);

        //hapus yg di browser /UI
        UICtrl.deleteListItem(currentItem.id);

        //ubah data saat di update
        const totalHarga = ItemCtrl.getTotalHarga();

        UICtrl.showTotalHarga(totalHarga);
        StorageCtrl.deleteItemFromStorage(currentItem.id)
        //menhilangkan kolom saat terupdate
        UICtrl.clearEditState();

        e.preventDefault();

    }

    const clearAllItemClick = function (){
        //hapus semua data yang ada di form
        ItemCtrl.clearAllItem();

        const totalHarga = ItemCtrl.getTotalHarga();

        UICtrl.showTotalHarga(totalHarga);

        UICtrl.removeItems();
        StorageCtrl.clearItemFromStorage();

        UICtrl.hideList();
    }


    return {
        init: function(){
            
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItemList(items);
            }

            const totalHarga = ItemCtrl.getTotalHarga();
            // total harga yg akan ditampilkan ke use
            //add total harga to UI
            UICtrl.showTotalHarga(totalHarga);

            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();