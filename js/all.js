document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://data.moa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx'; 
    const searchButton = document.querySelector('.search');
    const cropInput = document.getElementById('crop');
    const showList = document.querySelector('.showList');
    const sortSelect = document.getElementById('js-select');
    let cropName = cropInput.value.trim();
    const categoryButtons = document.querySelectorAll('.btn-type');

    function renderData(data) {
        showList.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.作物名稱}</td>
            <td>${item.市場名稱}</td>
            <td>${item.上價}</td>
            <td>${item.中價}</td>
            <td>${item.下價}</td>
            <td>${item.平均價}</td>
            <td>${item.交易量}</td>
            `;
            showList.appendChild(row);
        });
    }

    searchButton.addEventListener('click', function() {
        cropName = cropInput.value.trim();
        if (!cropName) {
            alert('請輸入欲查詢的作物名稱');
            return;
        }
        showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中...</td></tr>`;
        axios.get(`${apiUrl}?Crop=${cropName}`)
            .then(function(response) {
                renderData(response.data);
            })
            .catch(function(error) {
                console.error('Error fetching data:', error);
                showList.innerHTML = `<tr><td colspan="6" class="text-center p-3">資料抓取失敗QAQ</td></tr>`;
            });
    });

    sortSelect.addEventListener('change', function() {
        cropName = cropInput.value.trim();
        if (!cropName) {
            alert('請輸入欲查詢的作物名稱');
            return;
        }
        const sortBy = this.value;
        let sortedData = Array.from(document.querySelectorAll('.showList tr')).map(tr => {
            return {
                element: tr,
                作物名稱: tr.children[0].innerText,
                市場名稱: tr.children[1].innerText,
                上價: parseFloat(tr.children[2].innerText),
                中價: parseFloat(tr.children[3].innerText),
                下價: parseFloat(tr.children[4].innerText),
                平均價: parseFloat(tr.children[5].innerText),
                交易量: parseFloat(tr.children[6].innerText)
            };
        });
        sortedData.sort((a, b) => {
            switch(sortBy) {
                case '依上價排序':
                    return a.上價 - b.上價;
                case '依中價排序':
                    return a.中價 - b.中價;
                case '依下價排序':
                    return a.下價 - b.下價;
                case '依平均價排序':
                    return a.平均價 - b.平均價;
                case '依交易量排序':
                    return a.交易量 - b.交易量;
                default:
                    return 0;
            }
        });
        showList.innerHTML = ''; 
        sortedData.forEach(item => {
            showList.appendChild(item.element);
        });
    });

    function sortData(sortField, ascending) {
        let data = Array.from(document.querySelectorAll('.showList tr')).map(tr => {
            return {
                element: tr,
                作物名稱: tr.children[0].innerText,
                市場名稱: tr.children[1].innerText,
                上價: parseFloat(tr.children[2].innerText),
                中價: parseFloat(tr.children[3].innerText),
                下價: parseFloat(tr.children[4].innerText),
                平均價: parseFloat(tr.children[5].innerText),
                交易量: parseFloat(tr.children[6].innerText)
            };
        });

        data.sort((a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];
            if (ascending) {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });

        showList.innerHTML = '';
        data.forEach(item => {
            showList.appendChild(item.element);
        });
    }

    document.querySelectorAll('.sort-advanced i').forEach(icon => {
        icon.addEventListener('click', function() {
            const sortField = this.getAttribute('data-price');
            const sortOrder = this.getAttribute('data-sort');
            sortData(sortField, sortOrder === 'up');
            sortSelect.value = "排序篩選"
        });
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const categoryType = this.getAttribute('data-type');
            showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中...</td></tr>`;
            axios.get(`${apiUrl}?Crop=${cropName}&TcType=${categoryType}`)
                .then(function(response) {
                    renderData(response.data);
                })
                .catch(function(error) {
                    console.error('Error fetching data:', error);
                    showList.innerHTML = `<tr><td colspan="6" class="text-center p-3">資料抓取失敗QAQ</td></tr>`;
                });
        });
    });

});

