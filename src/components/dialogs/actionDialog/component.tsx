import React from "react";
import "./actionDialog.css";
import { Trans } from "react-i18next";
import { ActionDialogProps, ActionDialogState } from "./interface";
import AddTrash from "../../../utils/readUtils/addTrash";

import Parser from "html-react-parser";
import * as DOMPurify from "dompurify";

import ShelfUtil from "../../../utils/readUtils/shelfUtil";
import toast from "react-hot-toast";
import BookUtil from "../../../utils/fileUtils/bookUtil";
import {
  exportHighlights,
  exportNotes,
} from "../../../utils/syncUtils/exportUtil";
declare var window: any;
class ActionDialog extends React.Component<
  ActionDialogProps,
  ActionDialogState
> {
  constructor(props: ActionDialogProps) {
    super(props);
    this.state = {
      isShowExport: false,
      isExceed: false,
    };
  }
  handleDeleteBook = () => {
    this.props.handleReadingBook(this.props.currentBook);
    this.props.handleDeleteDialog(true);
    this.props.handleActionDialog(false);
  };
  handleEditBook = () => {
    this.props.handleEditDialog(true);
    this.props.handleReadingBook(this.props.currentBook);
    this.props.handleActionDialog(false);
  };
  handleAddShelf = () => {
    this.props.handleAddDialog(true);
    this.props.handleReadingBook(this.props.currentBook);
    this.props.handleActionDialog(false);
  };
  handleRestoreBook = () => {
    AddTrash.clear(this.props.currentBook.key);
    this.props.handleActionDialog(false);
    toast.success(this.props.t("Restore Successfully"));
    this.props.handleFetchBooks();
  };
  render() {
    if (this.props.mode === "trash") {
      return (
        <div
          className="action-dialog-container"
          onMouseLeave={() => {
            this.props.handleActionDialog(false);
          }}
          onMouseEnter={() => {
            this.props.handleActionDialog(true);
          }}
          style={{
            left: this.props.left,
            top: this.props.top,
          }}
        >
          <div className="action-dialog-actions-container">
            <div
              className="action-dialog-add"
              onClick={() => {
                this.handleRestoreBook();
              }}
            >
              <span className="icon-clockwise view-icon"></span>
              <span className="action-name">
                <Trans>Restore</Trans>
              </span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <>
        <div
          className="action-dialog-container"
          onMouseLeave={() => {
            this.props.handleActionDialog(false);
          }}
          onMouseEnter={() => {
            this.props.handleActionDialog(true);
          }}
          style={{ left: this.props.left, top: this.props.top }}
        >
          <div className="action-dialog-actions-container">
            <div
              className="action-dialog-add"
              onClick={() => {
                this.handleAddShelf();
              }}
            >
              <span className="icon-shelf view-icon"></span>
              <p className="action-name">
                <Trans>Add to Shelf</Trans>
              </p>
            </div>
            <div
              className="action-dialog-delete"
              onClick={() => {
                this.handleDeleteBook();
              }}
            >
              <span className="icon-trash view-icon"></span>
              <p className="action-name">
                <Trans>Delete</Trans>
              </p>
            </div>
            <div
              className="action-dialog-edit"
              onClick={() => {
                this.handleEditBook();
              }}
            >
              <span className="icon-edit view-icon"></span>
              <p className="action-name">
                <Trans>Edit</Trans>
              </p>
            </div>
            <div
              className="action-dialog-edit"
              onMouseEnter={(event) => {
                this.setState({ isShowExport: true });
                const e = event || window.event;
                let x = e.clientX;
                if (x > document.body.clientWidth - 300) {
                  this.setState({ isExceed: true });
                } else {
                  this.setState({ isExceed: false });
                }
              }}
              onMouseLeave={(event) => {
                this.setState({ isShowExport: false });
                event.stopPropagation();
              }}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <p className="action-name" style={{ marginLeft: "0px" }}>
                <span
                  className="icon-more view-icon"
                  style={{
                    display: "inline-block",
                    marginRight: "15px",
                    transform: "rotate(90deg)",
                  }}
                ></span>
                <Trans>More Actions</Trans>
              </p>

              <span
                className="icon-dropdown icon-export-all"
                style={{ left: "95px" }}
              ></span>
            </div>

            <div className="sort-dialog-seperator"></div>

            <div className="action-dialog-book-info">
              <div>
                <p className="action-dialog-book-publisher">
                  <Trans>Book Name</Trans>:
                </p>
                <p className="action-dialog-book-title">
                  {this.props.currentBook.name}
                </p>
                <p className="action-dialog-book-publisher">
                  <Trans>Author</Trans>:
                </p>
                <p className="action-dialog-book-title">
                  <Trans>{this.props.currentBook.author}</Trans>
                </p>
              </div>
              <div>
                <p className="action-dialog-book-publisher">
                  <Trans>Publisher</Trans>:
                </p>
                <p className="action-dialog-book-title">
                  {this.props.currentBook.publisher}
                </p>
              </div>
              <div>
                <p className="action-dialog-book-publisher">
                  <Trans>File size</Trans>:
                </p>
                <p className="action-dialog-book-title">
                  {this.props.currentBook.size
                    ? this.props.currentBook.size / 1024 / 1024 > 1
                      ? parseFloat(
                          this.props.currentBook.size / 1024 / 1024 + ""
                        ).toFixed(2) + "Mb"
                      : parseInt(this.props.currentBook.size / 1024 + "") + "Kb"
                    : // eslint-disable-next-line
                      "0" + "Kb"}
                </p>
              </div>
              <div>
                <p className="action-dialog-book-added">
                  <Trans>Added at</Trans>:
                </p>
                <p className="action-dialog-book-title">
                  {new Date(parseInt(this.props.currentBook.key))
                    .toLocaleString()
                    .replace(/:\d{1,2}$/, " ")}
                </p>
              </div>
              <div>
                <p className="action-dialog-book-publisher">
                  <Trans>Shelf</Trans>:
                </p>
                <p className="action-dialog-book-title">
                  {ShelfUtil.getBookPosition(this.props.currentBook.key).map(
                    (item) => (
                      <>
                        #<Trans>{item}</Trans>&nbsp;
                      </>
                    )
                  )}
                </p>
              </div>
              <div>
                <p className="action-dialog-book-desc">
                  <Trans>Description</Trans>:
                </p>
                <div className="action-dialog-book-detail">
                  {Parser(
                    DOMPurify.sanitize(this.props.currentBook.description) ||
                      " "
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="action-dialog-container"
          onMouseLeave={() => {
            this.setState({ isShowExport: false });
            this.props.handleActionDialog(false);
          }}
          onMouseEnter={(event) => {
            this.setState({ isShowExport: true });
            this.props.handleActionDialog(true);
            event?.stopPropagation();
          }}
          style={
            this.state.isShowExport
              ? {
                  position: "fixed",
                  left: this.props.left + (this.state.isExceed ? -200 : 200),
                  top: this.props.top + 70,
                }
              : { display: "none" }
          }
        >
          <div
            className="action-dialog-edit"
            onClick={() => {
              BookUtil.fetchBook(
                this.props.currentBook.key,
                true,
                this.props.currentBook.path
              ).then((result: any) => {
                toast.success(this.props.t("Export Successfully"));
                window.saveAs(
                  new Blob([result]),
                  this.props.currentBook.name +
                    `.${this.props.currentBook.format.toLocaleLowerCase()}`
                );
              });
            }}
          >
            <p className="action-name">
              <Trans>Export Books</Trans>
            </p>
          </div>
          <div
            className="action-dialog-edit"
            onClick={() => {
              if (
                this.props.notes.filter(
                  (item) =>
                    item.bookKey === this.props.currentBook.key &&
                    item.notes !== ""
                ).length > 0
              ) {
                exportNotes(
                  this.props.notes.filter(
                    (item) => item.bookKey === this.props.currentBook.key
                  ),
                  [...this.props.books, ...this.props.deletedBooks]
                );
                toast.success(this.props.t("Export Successfully"));
              } else {
                toast(this.props.t("Nothing to export"));
              }
            }}
          >
            <p className="action-name">
              <Trans>Export Notes</Trans>
            </p>
          </div>
          <div
            className="action-dialog-edit"
            onClick={() => {
              if (
                this.props.notes.filter(
                  (item) =>
                    item.bookKey === this.props.currentBook.key &&
                    item.notes === ""
                ).length > 0
              ) {
                exportHighlights(
                  this.props.notes.filter(
                    (item) => item.bookKey === this.props.currentBook.key
                  ),
                  [...this.props.books, ...this.props.deletedBooks]
                );
                toast.success(this.props.t("Export Successfully"));
              } else {
                toast(this.props.t("Nothing to export"));
              }
            }}
          >
            <p className="action-name">
              <Trans>Export Highlights</Trans>
            </p>
          </div>
          <div
            className="action-dialog-edit"
            onClick={() => {
              toast(this.props.t("Precaching"));
              BookUtil.fetchBook(
                this.props.currentBook.key,
                true,
                this.props.currentBook.path
              ).then(async (result: any) => {
                let rendition = BookUtil.getRendtion(
                  result,
                  this.props.currentBook.format,
                  "",
                  this.props.currentBook.charset
                );
                let cache = await rendition.preCache(result);
                if (cache !== "err") {
                  BookUtil.addBook(
                    "cache-" + this.props.currentBook.key,
                    cache
                  );
                  toast.success(this.props.t("Precaching Successfully"));
                } else {
                  toast.error(this.props.t("Precaching failed"));
                }
              });
            }}
          >
            <p className="action-name">
              <Trans>Precache</Trans>
            </p>
          </div>
          <div
            className="action-dialog-edit"
            onClick={async () => {
              await BookUtil.deleteBook("cache-" + this.props.currentBook.key);
              toast.success(this.props.t("Delete Successfully"));
            }}
          >
            <p className="action-name">
              <Trans>Delete Precache</Trans>
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default ActionDialog;
