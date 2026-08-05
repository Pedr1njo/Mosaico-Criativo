const imageUpload = document.getElementById('imageUpload')
const mosaicContainer = document.getElementById('mosaicContainer')

function processFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = function(e) {
                const itemDiv = document.createElement('div')
                itemDiv.className = 'mosaic-item'
                itemDiv.setAttribute('draggable', 'true')
                const img = document.createElement('img')
                img.src = e.target.result
                img.alt = 'Imagem do mosaico'
                img.setAttribute('draggable', 'false')
                const removeBtn = document.createElement('button')
                removeBtn.className = 'remove-btn'
                removeBtn.innerHTML = '&times;'
                removeBtn.title = "Remover imagem"
                removeBtn.addEventListener('click', function(event) {
                    itemDiv.style.transform = 'scale(0)'
                    itemDiv.style.opacity = '0'
                    setTimeout(() => {
                        mosaicContainer.removeChild(itemDiv)
                    }, 300)
                })
                itemDiv.appendChild(img)
                itemDiv.appendChild(removeBtn)
                mosaicContainer.appendChild(itemDiv)
            }
            reader.readAsDataURL(file)
        }
    }
}


imageUpload.addEventListener('change', function (event){
    processFiles(event.target.files)
    imageUpload.value = ''
})


document.body.addEventListener('dragover', (e) => {
    e.preventDefault()
    document.body.classList.add('darg-over')
})

document.body.addEventListener('dragleave', (e) => {
    e.preventDefault()
    document.body.classList.remove('drag-over')
})

document.body.addEventListener('drop', (e) => {
    e.preventDefault()
    document.body.classList.remove('drag-over')
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0){
        processFiles(e.dataTransfer.files)
    } 
})

let draggedItem = null
mosaicContainer.addEventListener('dragstart', (e) => {
    if(e.target.classList.contains('mosaic-item')) {
        draggedItem = e.target
        setTimeout(() => draggedItem.classList.add('dragging'), 0)
    }
})

mosaicContainer.addEventListener('dragend', (e) => {
    if(draggedItem) {
        draggedItem.classList.remove('dragging')
        draggedItem = null
    }
})

mosaicContainer.addEventListener('dragover', (e) => {
    e.preventDefault()
    const targetItem = e.target.closest('.mosaic-item:not(.dragging)')
    if(targetItem && draggedItem && targetItem !== draggedItem) {
        const rect = targetItem.getBoundingClientRect()
        const isAfter = (e.clientX - rect.left) / rect.width > 0.5
        if (isAfter) {
            mosaicContainer.insertBefore(draggedItem,targetItem.nextSibling)
        }      else {
            mosaicContainer.insertBefore(draggedItem, targetItem)
        }
    } 
})