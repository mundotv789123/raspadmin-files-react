"use client";

import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Users() {
  const users = [
    { username: "teste 1" },
    { username: "teste 2" },
    { username: "teste 3" },
    { username: "teste 4" },
    { username: "teste 4" },
    { username: "teste 5" },
    { username: "teste 6" },
    { username: "teste 7" },
    { username: "teste 8" },
    { username: "teste 9" },
    { username: "teste 10" },
    { username: "teste 11" },
  ];
  const [editUser, setEditUser] = useState<object | null>(null);

  return (
    <div className="p-2 h-full bg-black bg-opacity-40 overflow-x-auto">
      <div className="container mx-auto">
        <div className="bg-black bg-opacity-50 my-4 p-4 text-center">
          <h3 className="text-xl font-bold">Lista de usuários</h3>
        </div>
        <div>
          <table className="w-full text-sm text-left text-white">
            <thead className="text-xs uppercase bg-black bg-opacity-60">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b bg-black border-stone-700 bg-opacity-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap text-white"
                  >
                    {user.username}
                  </th>
                  <td className="px-6 py-4 w-24">
                    <button type="button" onClick={() => setEditUser(user)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editUser && (
        <div
          tabIndex={-1}
          className="fixed top-0 left-0 right-0 z-50 items-center justify-center w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full flex bg-zinc-700 bg-opacity-30 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl max-h-full">
            <form className="relative rounded-lg shadow-sm bg-black bg-opacity-50">
              <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-200">
                <h3 className="text-xl font-semibold text-white">
                  Edita usuário
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                  onClick={() => setEditUser(null)}
                >
                  <FontAwesomeIcon icon={faXmark} className="text-md" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-6">
                    <label
                      htmlFor="userName"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Usuário
                    </label>
                    <input
                      type="text"
                      name="userName"
                      id="userName"
                      className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-black border-gray-500 placeholder-gray-400 text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bonnie"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="shadow-xs border text-sm rounded-lg block w-full p-2.5 bg-black border-gray-500 placeholder-gray-400 text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Confirmar senha
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="shadow-xs  border text-sm rounded-lg block w-full p-2.5 bg-black border-gray-500 placeholder-gray-400 text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t rounded-b border-gray-200 justify-end">
                <button
                  type="submit"
                  className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 outline-none hover:bg-blue-700 focus:ring-blue-800"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
