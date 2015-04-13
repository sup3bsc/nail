    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var fpsLabel = document.getElementById("fpsLabel");
    var camPosTxt = document.getElementById("camPosTxt");

//*********************Full Screen******************************************************************
    var fullscreen = document.getElementById("fullscreenButton");

    fullscreen.onclick = function() {
        if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
        }
    }
//*********************FIN Full Screen*************************************************************

    var createScene = function () {
    
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        camera.keysUp = [90]; // Touche Z
        camera.keysDown = [83]; // Touche S
        camera.keysLeft = [81]; // Touche Q
        camera.keysRight = [68]; // Touche D;
        camera.checkCollisions = true;


        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
    
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    
        // This creates a light
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(125, 125, -125);
        light.intensity = 1;
        var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 10, scene);
        lightSphere.position = light.position;
        lightSphere.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        /*// sphere representing the light
        var sphere = BABYLON.Mesh.CreateSphere("toto", 50, 5, scene);
        sphere.position = new BABYLON.Vector3(5, -2, 10);
        sphere.checkCollisions = true;

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(4096, light);
        /*shadowGenerator.getShadowMap().renderList.push(sphere);
        shadowGenerator.usePoissonSampling = true;*/
    
        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = BABYLON.Mesh.CreateGround("ground1", 250, 250, 2, scene);
        ground.material = new BABYLON.StandardMaterial("gMaterial", scene);
        ground.material.diffuseTexture = new BABYLON.Texture("img/super_ground.jpg", scene);
        ground.material.diffuseTexture.uScale = 30;
        ground.material.diffuseTexture.vScale = 30;
        ground.material.backFaceCulling = true;//Allways show the front and the back of an element
        ground.checkCollisions = true;
        ground.position.y = -5;
        ground.receiveShadows = true;

        // Création d'une material
        var sMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
        sMaterial.backFaceCulling = false;
        sMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox", scene);
        sMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        sMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        // Création d'un cube avec la material adaptée
        var skybox = BABYLON.Mesh.CreateBox("skybox", 500, scene);
        skybox.material = sMaterial;
        skybox.infiniteDistance = true;
        
        return scene;
    
    };
//*****************************Creation et gestion de MESH*******************************************
    var geometries = {};
    var meshCount = -1;

    function Mesh()
    {
        var type = document.getElementById("mesh-type").value;
        switch(type)
        {
            case "box":
                mesh = BABYLON.Mesh.CreateBox(nom.value, 2, scene);
                break;

            case "sphere":
                mesh = BABYLON.Mesh.CreateSphere(nom.value, 50, 2, scene);
                break;

            case "cylinder":
                mesh = BABYLON.Mesh.CreateCylinder(nom.value, 2, 2, 2, 50, 1, scene, false);
                break;

            case "pyramid":
                mesh = BABYLON.Mesh.CreatePyramid4(nom.value , 2, 2, scene, false);
                break;

          default:
                mesh = BABYLON.Mesh.CreateSphere(nom.value, 50, 2, scene);
                break;
        }

        mesh.type = type;

        var colorMat = new BABYLON.StandardMaterial("color", scene);
        colorMat.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        colorMat.diffuseColor = new BABYLON.Color3(R/255,G/255,B/255);
        mesh.material = colorMat;
        return(mesh);
    }

    

    //Convertisseur hexa en RGB*******************************************
    var picker = document.getElementById('color'),
        c, R = 229.5, G = 229.5, B = 229.5;
    function hexToR(h) {return parseInt(h.substring(0,2),16)}
    function hexToG(h) {return parseInt(h.substring(2,4),16)}
    function hexToB(h) {return parseInt(h.substring(4,6),16)}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
    picker.onchange = function() {
        c = cutHex(this.value);
        R = hexToR(c);
        G = hexToG(c);
        B = hexToB(c);
        meshTab[index].material.emissiveColor.r = R/255;
        meshTab[index].material.emissiveColor.g = G/255;
        meshTab[index].material.emissiveColor.b = B/255;
    };
    //Fin convertisseur hexa en RGB****************************************
    
    var meshTab = []; //Tableau d'objets
    var index = 0;
    function indexation(x){ //En fonction du bouton cliqué donne l'index du tableau
        index = x;
    };

    var btn_add = document.getElementById('btn_add');
    btn_add.onclick = function()
    {
        meshCount ++; //index tu tableau d'objets
        index=meshCount;
        
        meshTab[meshCount] = new Mesh(); //Instanciation d'un objet 
        
        var button = document.createElement("button");// Cree un bouton 
        button.innerHTML= document.getElementById('name').value; // Met un titre au bouton 
        button.setAttribute("id", meshCount); // L'id sera l'index du tableau 
        button.setAttribute("onClick","indexation(parseInt(this.id))") ; // Donne la function qui gere quel bouton est cliqué 
        ["btn", "btn-success", "nav-justified"].forEach(button.classList.add.bind(button.classList)); // Ajoute des class
        document.getElementById("objets").appendChild(button); // Ajoute le bouton dans la page  
    };  

    var btn_sup = document.getElementById('btn_sup');
        for(i=0; i<nodes.length; i++) {
            }
        }        
    };

    var nom = document.getElementById('name');

    nom.onchange = function(){
        document.getElementById(index).innerHTML = nom.value;
        meshTab[index].name = nom.value;
    };

    var positiony = document.getElementById('posy');

    positiony.onchange = function() {
        meshTab[index].position.y = positiony.value;
    };

    var positionx = document.getElementById('posx');

    positionx.onchange = function() {
        meshTab[index].position.x = positionx.value;
    };

    var positionz = document.getElementById('posz');

    positionz.onchange = function() {
        meshTab[index].position.z = positionz.value;
    };

    var check = document.getElementById('check');

    check.onclick = function() {
        if ($(".hiden").css("display") == "none")
        {
            $(".hiden").css("display", "block");
        }
        else
        {    
            $(".hiden").css("display", "none");
        }
    };

    var taillex = document.getElementById('taillex');

    taillex.onchange = function() {
        meshTab[index].scaling.x = taillex.value;
        if (check.checked)
        {
            meshTab[index].scaling.y = taillex.value; 
            meshTab[index].scaling.z = taillex.value;
        }
    };

    var tailley = document.getElementById('tailley');

    tailley.onchange = function() {
        meshTab[index].scaling.y = tailley.value;
    };
       
    var taillez = document.getElementById('taillez');

    taillez.onchange = function() {
        meshTab[index].scaling.z = taillez.value;
    };

    var rotx = document.getElementById('rotx');

    rotx.onchange = function() {
        meshTab[index].rotation.x = rotx.value/100;
    };

    var roty = document.getElementById('roty');

    roty.onchange = function() {
        meshTab[index].rotation.y = roty.value/100;
    };
       
    var rotz = document.getElementById('rotz');

    rotz.onchange = function() {
        meshTab[index].rotation.z = rotz.value/100;
    };

//*****************************Fin Creation et gestion de MESH*******************************************

    document.getElementById('camReset').onclick = function() {
        console.log("click");
        scene.activeCamera.position = new BABYLON.Vector3(0, 0, 0);
    };

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
        fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";            
        camPosTxt.innerHTML = 'Position de la caméra X:' + scene.activeCamera.position.x.toFixed(2) + '&nbsp Y:' + scene.activeCamera.position.y.toFixed(2) + "&nbsp Z:" + scene.activeCamera.position.z.toFixed(2);
    });
    
    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });


    CreateLine = function (name, width, scene) {
        var line = BABYLON.Mesh.CreateLines(name, [
            new BABYLON.Vector3(-(width), 0, 0),
            new BABYLON.Vector3(width, 0, 0)
        ], scene);
        
        return line;
    }

//****************************************Pyramide**************************************************
    BABYLON.Mesh.CreatePyramid4 = function (name, baseSize, height, scene, updatable) {
      var pyramid = new BABYLON.Mesh(name, scene);

    // Adding faces
    var positions = [
        // Front face
        0,  height/2,  0,
        baseSize/2, -height/2, baseSize/2,
        -baseSize/2, -height/2, baseSize/2,

        // Right face
        0, height/2, 0,
        baseSize/2, -height/2, -baseSize/2,
        baseSize/2, -height/2, baseSize/2,

        // Back face
        0, height/2,  0,
        -baseSize/2, -height/2, -baseSize/2,
        baseSize/2, -height/2, -baseSize/2,

        // Left face
        0, height/2,  0,
        -baseSize/2, -height/2, baseSize/2,
        -baseSize/2, -height/2, -baseSize/2,

        // Bottom face
        -baseSize/2, -height/2, baseSize/2,
        baseSize/2, -height/2, baseSize/2,
        baseSize/2, -height/2, -baseSize/2,
        -baseSize/2, -height/2, -baseSize/2
    ];

    var normals = [
        height, baseSize/2, 0,
        height, baseSize/2, 0,
        height, baseSize/2, 0,

        0, baseSize/2, height,
        0, baseSize/2, height,
        0, baseSize/2, height,

        -height, baseSize/2, 0,
        -height, baseSize/2, 0,
        -height, baseSize/2, 0,

        0, baseSize/2, -height,
        0, baseSize/2, -height,
        0, baseSize/2, -height,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0
    ];

    var indices = [];
    var uvs = [];
    var i = 0;
    while (i < 12) {
        indices.push(i+0);
        uvs.push(1.0, 1.0);
        indices.push(i+1);
        uvs.push(0.0, 1.0);
        indices.push(i+2);
        uvs.push(0.0, 0.0);
        i = i+3;
    }

    indices.push(12);
    indices.push(13);
    indices.push(14);

    indices.push(12);
    indices.push(14);
    indices.push(15);

    uvs.push(1.0, 1.0);
    uvs.push(0.0, 1.0);
    uvs.push(0.0, 0.0);
    uvs.push(1.0, 0.0);

    pyramid.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, updatable);
    pyramid.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, updatable);
    pyramid.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs, updatable);
    pyramid.setIndices(indices);

    return pyramid;     
    }
//****************************************Fin Pyramide***********************************************
//****************************************Save***********************************************
    var save = document.getElementById("save");
    save.onclick = function()
    {
        var meshs = meshTab.map(function(mesh)
        {
            return ["type", "position", "scaling", "material.diffuseColor", "name"].map(function(key)
            {
                var current = mesh;
                return key.split(".").reduce(function(current, k)
                {
                    return current[k];
                }, mesh);
            });
        });

        var textToWrite = JSON.stringify(meshs);

        var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
        var fileNameToSaveAs = "world.nail";

        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.URL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    }
//****************************************Fin Save***********************************************