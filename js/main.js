// Khởi tạo
var dsnv = new DanhSachNhanVien();
var nhanVien = new NhanVien();
var validation = new Validation();

getLocalStorage();

function getEle(id) {
  return document.getElementById(id);
}

function layThongTinNhanVien(isAdd) {
  // Lấy thông tin user nhập vào
  var _taiKhoan = getEle("tknv").value;
  var _hoVaTen = getEle("name").value;
  var _email = getEle("email").value;
  var _matKhau = getEle("password").value;
  var _ngayLam = getEle("datepicker").value;
  var _luongCoBan = getEle("luongCB").value;
  var _chucVu = getEle("chucvu").value;
  var _gioLam = getEle("gioLam").value;

  // flag
  var isValid = true;

  if (isAdd) {
    isValid &=
      validation.kiemTraRong(
        _taiKhoan,
        "tbTKNV",
        "(*) Vui lòng nhập vào tài khoản"
      ) &&
      validation.kiemTraDoDaiKyTu(
        _taiKhoan,
        "tbTKNV",
        "(*) Vui lòng nhập vào từ 4 đến 6 ký tự",
        4,
        6
      ) &&
      validation.kiemTraTaiKhoanTrung(
        _taiKhoan,
        "tbTKNV",
        "(*) Tài khoản bị trùng, xin vui lòng nhập tài khoản khác",
        dsnv.list
      );
  }

  isValid &=
    validation.kiemTraRong(
      _hoVaTen,
      "tbTen",
      "(*) Vui lòng nhập vào họ và tên"
    ) && validation.kiemTraKyTu(_hoVaTen, "tbTen", "(*) Vui lòng nhập vào chữ");
  isValid &=
    validation.kiemTraRong(_email, "tbEmail", "(*) Vui lòng nhập vào email") &&
    validation.kiemTraEmail(
      _email,
      "tbEmail",
      "(*) Email không đúng định dạng"
    );
  isValid &=
    validation.kiemTraRong(
      _matKhau,
      "tbMatKhau",
      "(*) Vui lòng nhập vào mật khẩu"
    ) &&
    validation.kiemTraDoDaiKyTu(
      _matKhau,
      "tbMatKhau",
      "(*) Vui lòng nhập vào từ 6 đến 10 ký tự",
      6,
      10
    ) &&
    validation.kiemTraMatKhau(
      _matKhau,
      "tbMatKhau",
      "(*) Mật khẩu chưa đủ mạnh"
    );
  isValid &= validation.kiemTraRong(
    _ngayLam,
    "tbNgay",
    "(*) Vui lòng nhập vào ngày làm"
  );
  isValid &=
    validation.kiemTraRong(
      _luongCoBan,
      "tbLuongCB",
      "(*) Vui lòng nhập vào lương cơ bản"
    ) &&
    validation.kiemTraLuongCoBan(
      _luongCoBan,
      "tbLuongCB",
      "(*) Vui lòng nhập mức lương từ 1.000.000vnđ đến 20.000.000vnđ"
    );
  isValid &=
    validation.kiemTraRong(
      _chucVu,
      "tbChucVu",
      "(*) Vui lòng nhập vào chức vụ"
    ) &&
    validation.kiemTraChucVu("chucvu", "tbChucVu", "(*) Vui lòng chọn chức vụ");
  isValid &=
    validation.kiemTraRong(
      _gioLam,
      "tbGiolam",
      "(*) Vui lòng nhập vào giờ làm"
    ) &&
    validation.kiemTraGioLam(
      _gioLam,
      "tbGiolam",
      "(*) Vui lòng giờ làm từ 80 giờ đến 200 giờ "
    );

  if (isValid) {
    // Khởi tạo
    var nhanVien = new NhanVien(
      _taiKhoan,
      _hoVaTen,
      _email,
      _matKhau,
      _ngayLam,
      _luongCoBan,
      _chucVu,
      _gioLam
    );
    nhanVien.tongLuong();
    nhanVien.xepLoai();
    return nhanVien;
  }
  return null;
}

getEle("btnThemNV").addEventListener("click", function (event) {
  event.preventDefault();

  var nhanVien = layThongTinNhanVien(true);
  if (!nhanVien) return;
  dsnv.themNhanVien(nhanVien);
  taoBang(dsnv.list);
  setLocalStorage();
});

function taoBang(arr) {
  var contentHTML = "";
  for (var i = 0; i < arr.length; i++) {
    contentHTML += `
      <tr>
          <td>${arr[i].taiKhoan}</td>
          <td>${arr[i].hoVaTen}</td>
          <td>${arr[i].email}</td>
          <td>${arr[i].ngayLam}</td>
          <td>${arr[i].chucVu}</td>
          <td>${arr[i].tongLuong}</td>
          <td>${arr[i].xepLoai}</td>
          <td>
              <button class="btn btn-info btn-sm" data-toggle="modal"
                    data-target="#myModal" onclick="suaNhanVien('${arr[i].taiKhoan}')">Sửa</button>
              <button class="btn btn-danger btn-sm" onclick="xoaNhanVien('${arr[i].taiKhoan}')">Xoá</button>
          </td>
      </tr>
    `;
  }
  getEle("tableDanhSach").innerHTML = contentHTML;
}

// Xoá nhân viên
function xoaNhanVien(taiKhoan) {
  dsnv.xoaNhanVien(taiKhoan);
  taoBang(dsnv.list);
  setLocalStorage();
}

// Sửa nhân viên
function suaNhanVien(taiKhoan) {
  console.log(taiKhoan);

  // getEle("btnCapNhat").style.display = "block";

  // Hiển thị thông tin nhân viên ra form
  var nhanVien = dsnv.suaNhanVien(taiKhoan);

  if (nhanVien) {
    getEle("tknv").value = nhanVien.taiKhoan;
    getEle("tknv").disabled = true;

    getEle("name").value = nhanVien.hoVaTen;
    getEle("email").value = nhanVien.email;
    getEle("password").value = nhanVien.matKhau;
    getEle("datepicker").value = nhanVien.ngayLam;
    getEle("luongCB").value = nhanVien.luongCoBan;
    getEle("chucvu").value = nhanVien.chucVu;
    getEle("gioLam").value = nhanVien.gioLam;
  }
}

// Cập nhật nhân viên
getEle("btnCapNhat").addEventListener("click", function () {
  var nhanVien = layThongTinNhanVien(false);
  if (nhanVien) {
    // Cập nhật nhân viên
    dsnv.capNhatNhanVien(nhanVien);
    taoBang(dsnv.list);
    setLocalStorage();
  }
});

/**
 * Tìm kiếm
 */

getEle("searchName").addEventListener("keyup", function () {
  var keyword = getEle("searchName").value;
  var mangTimKiem = dsnv.timNhanVien(keyword);

  taoBang(mangTimKiem);
});

function setLocalStorage() {
  // Chuyển kiểu JSON -> String
  var arrString = JSON.stringify(dsnv.list);
  // Lưu xuống localStorage
  localStorage.setItem("DSNV", arrString);
}

function getLocalStorage() {
  if (localStorage.getItem("DSNV")) {
    dsnv.list = JSON.parse(localStorage.getItem("DSNV"));
    taoBang(dsnv.list);
  }
}
