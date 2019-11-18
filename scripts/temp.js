function mat4x4parallel(vrp, vpn, vup, prp, clip) {
    // 1. translate VRP to the origin
    // 2. rotate VRC such that n-axis (VPN) becomes the z-axis, 
    //    u-axis becomes the x-axis, and v-axis becomes the y-axis
    // 3. shear such that the DOP becomes parallel to the z-axis
    // 4. translate and scale into canonical view volume
    //    (x = [-1,1], y = [-1,1], z = [0,-1])

    // 1.
    var Tvrp = mat4x4translate(-vrp.x, -vrp.y, -vrp.z);
    // 2.
    var n_axis = Vector3(vpn.x, vpn.y, vpn.z);
    n_axis.normalize();
    var u_axis = vup.cross(n_axis);
    u_axis.normalize()
    let v_axis = n_axis.cross(u_axis);
    u_axis.x
    var rotateVRC = new Matrix(4,4);
    rotateVRC.values = [[u_axis.x, u_axis.y, u_axis.z,0],[v_axis.x, v_axis.y, v_axis.z, 0],[n_axis.x, n_axis.y, n_axis.z, 0],[0,0,0,1]]
    // 3.
    var Tprp = mat4x4translate(-prp.x, -prp.y, -prp.z);
    // 4.
    var DOP_x = ((clip[0] + clip[1])/2); // center of window on the X
    var DOP_y = ((clip[2] + clip[3])/2); // center of window on the Y
    const Z = 0; // the Z is usually 0
    var CW = Vector3(DOP_x, DOP_y, Z); // center of window Vector
    var DOP = CW.subtract(prp); // From class slides DOP = CW - PRP
    var shxpar = (-DOP.x) / DOP.z;
    var shypar = (-DOP.y) / DOP.z;
    var SHEARxy = mat4x4shearxy(shxpar, shypar);



}

function mat4x4perspective(vrp, vpn, vup, prp, clip) {
    // 1. translate VRP to the origin
    // 2. rotate VRC such that n-axis (VPN) becomes the z-axis, 
    //    u-axis becomes the x-axis, and v-axis becomes the y-axis
    // 3. translate PRP to the origin
    // 4. shear such that the center line of the view volume becomes the z-axis
    // 5. scale into canonical view volume (truncated pyramid)
    //    (x = [z,-z], y = [z,-z], z = [-z_min,-1])
    
    // 1.
    var Tvrp = new Matrix(4,4);
    Tvrp.values = [
        [1, 0, 0, -vrp.x],
        [0, 1, 0, -vrp.y],
        [0, 0, 1, -vrp.z],
        [0, 0, 0, 1]
    ];
    // 2.
    var n_axis = new Vector3(vpn.x, vpn.y, vpn.z);
    n_axis.normalize();
    var u_axis = vup.cross(n_axis);
    u_axis.normalize()
    let v_axis = n_axis.cross(u_axis);
    var rotateVRC = new Matrix(4,4);
    rotateVRC.values = [
        [u_axis.x, u_axis.y, u_axis.z, 0],
        [v_axis.x, v_axis.y, v_axis.z, 0],
        [n_axis.x, n_axis.y, n_axis.z, 0],
        [0, 0, 0, 1]
    ];
    // 3.
    var Tprp = new Matrix(4,4);
    Tprp.values = [
        [1, 0, 0, -prp.x],
        [0, 1, 0, -prp.y],
        [0, 0, 1, -prp.z],
        [0, 0, 0, 1]
    ];
    // 4.
    var DOP_x = (clip[0] + clip[1])/2; // center of window on the X
    var DOP_y = (clip[2] + clip[3])/2; // center of window on the Y
    const Z = 0; // the Z is usually 0
    var CW = new Vector3(DOP_x, DOP_y, Z); // center of window Vector
    var DOP = CW.subtract(prp); // From class slides DOP = CW - PRP
    var shxpar = (-DOP.x) / DOP.z;
    var shypar = (-DOP.y) / DOP.z;
    var SHEARxy = new Matrix(4,4);
    SHEARxy.values = [
        [1, 0, shxpar, 0],
        [0, 1, shypar, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    // 5.
    var VRP_prime = -prp.z;
    var scale_pers_x = ((2 * VRP_prime) / ((clip[1] - clip[0]) * (VRP_prime + clip[5])));
    var scale_pers_y = ((2 * VRP_prime) / ((clip[3] - clip[2]) * (VRP_prime + clip[5])));
    var scale_pers_z = (-1 / (VRP_prime + clip[5]));
    var Spers = new Matrix(4,4);
    Spers.values = [
        [scale_pers_x, 0, 0, 0],
        [0, scale_pers_y, 0, 0],
        [0, 0, 0, scale_pers_z],
        [0, 0, 0, 1]
    ];
    //var Nper = Matrix.multiply(Spers, SHEARxy, Tprp, rotateVRC, Tvrp);
    return Matrix.multiply(Spers, SHEARxy, Tprp, rotateVRC, Tvrp);
}